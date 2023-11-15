const asyncHandler = require('express-async-handler')
const ErrHandeling = require('../utils/ErrorHandler')
const openai = require('../utils/openaiConfig')

//@desc Generate description
//@route POST /api/v1/openai/generate
//@access privet
const generateDescription = asyncHandler(async (req, res, next)=>{
    const {topic} = req.body
    if (topic ?? true){
        return next(new ErrHandeling("please provide a topic", 400))
    }
    const COMPLETION = await openai.chat.completions.create({
        message:[{
            role: "user", content: `Come up with a description for YouTube video called ${topic}.`
        }],
        model: "gpt-3.5-turbo",
        max_tokens: 100
    })
    console.log("done")
    const result = COMPLETION.choices[0].message.content.replace(/\n/g, '')
    console.log(result)
    res.status(200).json({message: result})
})

module.exports = {
    generateDescription
}