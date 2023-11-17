import type { NextFunction, Request, Response } from "express"
import { promtTypes } from "types"

const asyncHandler = require('express-async-handler')
const ErrHandeling = require('../utils/ErrorHandler')
const openai = require('../utils/openaiConfig')

//@desc Generate description
//@route POST /api/v1/openai/generate
//@access privet
const generateDescription = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { Role, Number_of_Posts_to_Generate, Social_Media_Platform, Tone, Avoid, Emoji, Number_of_Words }: promtTypes = req.body

    const COMPLETION = await openai.chat.completions.create({
        message: [{
            role: "user",
            content: `Act as a ${Role} to generate ${Number_of_Posts_to_Generate} posts on ${Social_Media_Platform}. Inspire {Audience} to embrace $[Topic}. Maintain a ${Tone} tone, avoid ${Avoid}, ${Emoji && 'and use emojis to make it engaging'}. Each post should be concise, around ${Number_of_Words}`
        }] as const,
        model: "gpt-3.5-turbo" as const,
        max_tokens: 100 as const
    })

    const result: string = COMPLETION.choices[0].message.content.replace(/\n/g, '')
    return res.status(200).json({ message: result })
})

module.exports = {
    generateDescription
}