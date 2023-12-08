"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.getLastContent = exports.getContent = exports.getTopic = exports.saveGeneratedContent = exports.generateDescription = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const openaiConfig_1 = __importDefault(require("../utils/openaiConfig"));
const prismaClient_1 = require("../utils/prismaClient");
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
    res.status(200).json({ message: result });
});
// TODO: adding zod validation
exports.saveGeneratedContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { topic, contentGenerated, platform } = req.body;
    const createdTopic = await prismaClient_1.prisma.topic.create({
        data: {
            topic: topic
        }
    });
    if (!createdTopic)
        return next(new ErrorHandler_1.default("somthing went wrong", 404));
    contentGenerated.forEach(async (cont) => {
        await prismaClient_1.prisma.content.create({
            data: {
                userId: user.id,
                topicId: createdTopic.id,
                plateformname: platform,
                body: cont
            }
        });
    });
    res.status(201).json({ message: "successfully saved" });
});
//@desc get topic
//@route GET /api/v1/openai/topic
//@access private
exports.getTopic = (0, express_async_handler_1.default)(async (req, res, next) => {
    const topic = await prismaClient_1.prisma.topic.findMany({
        take: 10
    });
    if (!topic)
        return next(new ErrorHandler_1.default("no topic found", 404));
    res.status(200).json({ topic: topic });
});
//@desc get user content
//@route GET /api/v1/openai/content
//@access private
exports.getContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const platform = req.query.platform;
    let query = {};
    if (platform) {
        query = { userId: user.id, plateformname: platform };
    }
    else {
        query = { userId: user.id };
    }
    const content = await prismaClient_1.prisma.content.findMany({
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
    });
    if (!content)
        return next(new ErrorHandler_1.default("no content found", 404));
    res.status(200).json({ content: content });
});
//@desc get user last content
//@route GET /api/v1/openai/last-content
//@access private
exports.getLastContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const content = await prismaClient_1.prisma.content.findMany({
        where: {
            userId: user.id,
        },
        select: {
            plateformname: true,
            topic: true
        },
        take: 5
    });
    if (!content)
        return next(new ErrorHandler_1.default("no content found", 404));
    res.status(200).json({ content: content });
});
//@desc delete user content
//@route Delete /api/v1/openai/content/:id
//@access private
exports.deleteContent = (0, express_async_handler_1.default)(async (req, res, next) => {
    const id = req.params.id;
    const content = await prismaClient_1.prisma.content.delete({
        where: {
            id: id,
        },
    });
    const stillContent = await prismaClient_1.prisma.content.findFirst({
        where: {
            topicId: content.topicId
        }
    });
    if (!stillContent) {
        const topic = await prismaClient_1.prisma.topic.delete({
            where: {
                id: content.topicId
            }
        });
        if (!topic)
            return next(new ErrorHandler_1.default("no topic found", 404));
    }
    if (!content)
        return next(new ErrorHandler_1.default("no content found", 404));
    res.status(200).json({ message: "successfully deleted" });
});
//# sourceMappingURL=openaiController.js.map