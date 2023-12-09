# API for Content Generator based on open ai

This API utilizes OpenAI's chat completions to generate content based on user-provided data. The project is implemented in TypeScript.

## Usage

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

### Authentication

To access the API, you need to provide authentication credentials. Currently, we support Google OAuth and credentials-based authentication.

**1- auth routes:**

#### Google OAuth

-   **Register/Login:** `method = GET | body = null | query = null| url = baseurl/api/v1/auth/google`
-   **Google Callbacks:** `method = GET | body = null | query = null | url = baseurl/api/v1/auth/google/callback`
-   **Verify User:** `method = GET | body | query | url = baseurl/api/v1/auth/verify-user`

#### Credentials Authentication

-   **Register:** `method = POST | body = {email, username, password} | query = null | rul = baseurl/api/v1/auth/register`
-   **Login:** `method = POST | body = {email, password} | query = null | rul = baseurl/api/v1/auth/login`
-   **Logout:** `method = GET | body = null | query = null | rul = baseurl/api/v1/auth/logout`

**2- openAI routes:**

### users content and topic

-   **all topics:** `method = GET | body = null | query = null | url baseurl/api/v1/openai/topic`

-   **user contents:** `method = GET | body = null | query = platform ? | url = baseurl/api/v1/openai/content`

-   **last content:** `method = GET | body = null | query = null | url- = baseurl/api/v1/openai/last-content`

-   **generate content:** `method = POST | body = {Role, Topic, Number_of_Posts_to_Generate, Audience, Social_Media_Platform, Hashtags, Tone, Number_of_Words} | query = null | url = baseurl/api/v1/openai/generate`

-   **save content:** `method = POST | body = {topic, contentGenerated, platform} | query = null | url = baseurl/api/v1/openai/content`

-   **delete content:** `method = DELETE | body = null | query = null | url = baseurl/api/v1/openai/content/:id`

## API Key and Environmental Variables

To use this API, you need to obtain an API key from OpenAI. Follow [this link](https://platform.openai.com/) to get your API key. And [this link](https://console.cloud.google.com/) to get google client secret and id.

In the `.env` file, configure the following variables:

```dotenv
NODE_ENV="development"
PORT=3000
TOKEN_KEY=your_strong_key
DATABASE_URL=your_mongodb_database_url
API_KEY=your_openai_api_key
FRONT_URL=your_frontend_url
API_URL="http://localhost:"
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

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
