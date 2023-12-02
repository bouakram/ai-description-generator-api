"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDescription = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const openaiConfig_1 = __importDefault(require("../utils/openaiConfig"));
// TODO: change the name of the controller ind give it a unique name match the content of the controller
// TODO: generateDescription controller need update
// TODO: generateDescription controller need optimizations
// TODO: generateDescription controller need more features
// TODO: generateDescription controller need to fix the format of the results
//@desc Generate description
//@route POST /api/v1/openai/generate
//@access privet
exports.generateDescription = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { Role, Topic, Number_of_Posts_to_Generate, Audience, Social_Media_Platform, Hashtags, Tone, Number_of_Words } = req.body;
    const prompt = `Generate a post on ${Social_Media_Platform}. Inspire ${Audience} to embrace ${Topic}. Maintain a ${Tone} tone, The post content should be around ${Number_of_Words} words ${Hashtags && ',generate hashtags related to the topic'}.`;
    let Completion;
    let result = [];
    for (let i = 0; i < parseInt(Number_of_Posts_to_Generate); i++) {
        Completion = await openaiConfig_1.default.chat.completions.create({
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
            model: "gpt-3.5-turbo",
            // response_format: { type: "json_object" } as const,
            max_tokens: 120
        });
        const airesult = Completion.choices[0].message.content.replace(/\n/g, '');
        result.push(airesult);
    }
    console.log("result -----------------");
    console.log(result);
    res.status(200).json({ message: result });
});
//# sourceMappingURL=openaiController.js.map