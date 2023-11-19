import OpenAI from 'openai';
import { config } from 'dotenv'
config()

const openai = new OpenAI({ apiKey: process.env.API_KEY });

export default openai