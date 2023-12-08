import { ContentGenerated, PromtTypes } from "types"

import asyncHandler from 'express-async-handler'
import ErrHandeling from '../utils/ErrorHandler'
import openai from '../utils/openaiConfig'
import type { ChatCompletion } from "openai/resources/index.mjs"
import { prisma } from "../utils/prismaClient"
import { User } from "@prisma/client"

// TODO: change the name of the controller ind give it a unique name match the content of the controller
// TODO: generateDescription controller need update
// TODO: generateDescription controller need optimizations
// TODO: generateDescription controller need more features
// TODO: generateDescription controller need to fix the format of the results

//@desc Generate description
//@route POST /api/v1/openai/generate
//@access privet
export const generateDescription = asyncHandler(async (req, res, next) => {
    const { Role, Topic, Number_of_Posts_to_Generate, Audience, Social_Media_Platform, Hashtags, Tone, Number_of_Words }: PromtTypes = req.body
    const prompt = `Generate a post on ${Social_Media_Platform}. Inspire ${Audience} to embrace ${Topic}. Maintain a ${Tone} tone, The post content should be around ${Number_of_Words} words ${Hashtags && ',generate hashtags related to the topic'}.`
    let Completion: ChatCompletion
    let result = []
    for (let i = 0; i < parseInt(Number_of_Posts_to_Generate); i++) {
        Completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant designed to act as a ${Role}`,
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "gpt-3.5-turbo" as const,
            // response_format: { type: "json_object" } as const,
            max_tokens: 120 as const
        })
        const airesult = Completion.choices[0].message.content.replace(/\n/g, '')
        result.push(airesult)
    }

    res.status(200).json({ message: result })
})

// TODO: adding zod validation

export const saveGeneratedContent = asyncHandler(async (req, res, next) => {
    const user = req.user as Pick<User, "id" | "email">;
    const { topic, contentGenerated, platform }: ContentGenerated = req.body

    const createdTopic = await prisma.topic.create({
        data: {
            topic: topic
        }
    })
    if (!createdTopic) return next(new ErrHandeling("somthing went wrong", 404))

    contentGenerated.forEach(async (cont) => {
        await prisma.content.create({
            data: {
                userId: user.id,
                topicId: createdTopic.id,
                plateformname: platform,
                body: cont
            }
        })
    })

    res.status(201).json({ message: "successfully saved" })
})

//@desc get topic
//@route GET /api/v1/openai/topic
//@access private
export const getTopic = asyncHandler(async (req, res, next) => {
    const topic = await prisma.topic.findMany({
        take: 10
    })
    if (!topic) return next(new ErrHandeling("no topic found", 404))
    res.status(200).json({ topic: topic })
})

//@desc get user content
//@route GET /api/v1/openai/content
//@access private
export const getContent = asyncHandler(async (req, res, next) => {
    const user = req.user as Pick<User, "id" | "email">;
    const platform = req.query.platform
    let query: object = {}
    if (platform) {
        query = { userId: user.id, plateformname: platform }
    } else {
        query = { userId: user.id }
    }
    const content = await prisma.content.findMany({
        where: query,
        select: {
            id: true,
            plateformname: true,
            topic: {
                select: {
                    topic: true
                }
            },
            body: true
        }
    })
    if (!content) return next(new ErrHandeling("no content found", 404))
    res.status(200).json({ content: content })
})

//@desc get user last content
//@route GET /api/v1/openai/last-content
//@access private
export const getLastContent = asyncHandler(async (req, res, next) => {
    const user = req.user as Pick<User, "id" | "email">;
    const content = await prisma.content.findMany({
        where: {
            userId: user.id,
        },
        select: {
            plateformname: true,
            topic: true
        },
        take: 5
    });

    if (!content) return next(new ErrHandeling("no content found", 404))
    res.status(200).json({ content: content })
})

//@desc delete user content
//@route Delete /api/v1/openai/content/:id
//@access private
export const deleteContent = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const content = await prisma.content.delete({
        where: {
            id: id,
        },
    });
    const stillContent = await prisma.content.findFirst({
        where: {
            topicId: content.topicId
        }
    })
    if (!stillContent) {
        const topic = await prisma.topic.delete({
            where: {
                id: content.topicId
            }
        })
        if (!topic) return next(new ErrHandeling("no topic found", 404))
    }

    if (!content) return next(new ErrHandeling("no content found", 404))
    res.status(200).json({ message: "successfully deleted" })
})