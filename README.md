# API for Content Generator based on open ai

this is api for content generator use the open ai, it use the chat completions to generate content based on the users provided data. it created using typescript.

## Project Directory

**dir:** which contain the compiled code of typescript

**prisma:** which contain the schema it uses mongodb as backend

**src:** which contain the typescript source code

-   **src**
    -   **config**
        -   `passport.ts`
    -   **controllers**
        -   `authController.ts`
        -   `openaiController.ts`
    -   **middleware**
        -   `authMiddleware.ts`
        -   `errorMiddleware.ts`
    -   **routes**
        -   `authRoutes.ts`
        -   `openaiRoutes.ts`
    -   **token**
        -   `generateToken.ts`
    -   **utils**
        -   `ErrorHandler.ts`
        -   `openaiConfig.ts`
        -   `prismaClient.ts`
    -   `server.js`
    -   `types.ts`

## routes

the routes are as follows:

**1- auth routes:**

google auth

-   method = GET | body = null | query = null| url = baseurl/api/v1/auth/google
-   method = GET | body = null | query = null | url = baseurl/api/v1/auth/google/callback
-   method = GET | body | query | url = baseurl/api/v1/auth/verify-user

credentials auth

-   method = POST | body = {email, username, password} | query = null | rul = baseurl/api/v1/auth/register
-   method = POST | body = {email, password} | query = null | rul = baseurl/api/v1/auth/login

logout

-   method = GET | body = null | query = null | rul = baseurl/api/v1/auth/logout

**2- openAI routes:**

get all topics

-   method = GET | body = null | query = null | url baseurl/api/v1/openai/topic

get the user contents

-   method = GET | body = null | query = platform ? | url = baseurl/api/v1/openai/content

get the user last content

-   method = GET | body = null | query = null | url- = baseurl/api/v1/openai/last-content

generate a new content

-   method = POST | body = {Role, Topic, Number_of_Posts_to_Generate, Audience, Social_Media_Platform, Hashtags, Tone, Number_of_Words} | query = null | url = baseurl/api/v1/openai/generate

save the content

-   method = POST | body = {topic, contentGenerated, platform} | query = null | url = baseurl/api/v1/openai/content

delete a specific content

-   method = DELETE | body = null | query = null | url = baseurl/api/v1/openai/content/:id

## ENV file

in the .env file you need to put this variables:

```javascript
NODE_ENV="development"
PORT= put any port number
TOKEN_KEY= generate a strong key
DATABASE_URL= put your mongodb database url
API_KEY=put your open ai api key
FRONT_URL=your front end url
API_URL="http://localhost:"
GOOGLE_CLIENT_ID=put your google client id
GOOGLE_CLIENT_SECRET=put your google client secret
```

[Click here](https://platform.openai.com/) to get the api key.

[Click here](https://console.cloud.google.com/) to get the google id and client key.
