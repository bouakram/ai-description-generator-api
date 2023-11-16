const asyncHandler = require('express-async-handler')
const ErrHandeling = require('../utils/ErrorHandler')
const openai = require('../utils/openaiConfig')

//@desc Generate description
//@route POST /api/v1/openai/generate
//@access privet
const generateDescription = asyncHandler(async (req, res, next)=>{
    const {Role, Number_of_Posts_to_Generate, Social_Media_Platform, Tone, Avoid, Emoji, Number_of_Words} = req.body

    const COMPLETION = await openai.chat.completions.create({
        message:[{
            role: "user", 
            content: `Act as a ${Role} to generate ${Number_of_Posts_to_Generate} posts on ${Social_Media_Platform}. Inspire {Audience} to embrace $[Topic}. Maintain a ${Tone} tone, avoid ${Avoid}, ${Emoji && 'and use emojis to make it engaging'}. Each post should be concise, around ${Number_of_Words}`
        }],
        model: "gpt-3.5-turbo",
        max_tokens: 100
    })
    
    const result = COMPLETION.choices[0].message.content.replace(/\n/g, '')
    return res.status(200).json({message: result})
})

module.exports = {
    generateDescription
}