import { config } from 'dotenv'
config()

import jwt from 'jsonwebtoken'

function generateToken(id: string) {
    const token = jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: "15d"
    })
    return token
}

export default generateToken