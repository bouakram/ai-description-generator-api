export interface PromtTypes {
    Role: string,
    Number_of_Posts_to_Generate: string,
    Social_Media_Platform: string,
    Tone: string,
    Avoid: string,
    Audience: string,
    Topic: string,
    Emoji: boolean,
    Hashtags: boolean,
    Number_of_Words: number
}

export type ContentGenerated = {
    topic: string,
    contentGenerated: string[],
    platform: "Facebook" | "InstaGram" | "LinkedIn" | "Twitter"
}