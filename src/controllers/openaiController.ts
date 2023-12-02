import type { NextFunction, Request, Response } from "express"
import { PromtTypes } from "types"

import asyncHandler from 'express-async-handler'
import ErrHandeling from '../utils/ErrorHandler'
import openai from '../utils/openaiConfig'
import type { ChatCompletion } from "openai/resources/index.mjs"

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
    console.log("result -----------------")
    console.log(result)

    res.status(200).json({ message: result })
})