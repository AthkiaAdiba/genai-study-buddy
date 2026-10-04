# GenAI Study Buddy

A study assistant backend built with Node.js, Express and TypeScript. It generates topic explanations and quizzes, supports chat with conversation history supplied by the client, and uses embeddings to search sample study documents.

## Features

- Generate explanations at beginner, intermediate or advanced level, with three follow-up quiz questions.
- Send user and assistant messages to the model for conversational responses.
- Search sample documents in memory using embeddings and cosine similarity.
- Store and search document embeddings and metadata with ChromaDB.
- Validate requests with Zod and handle errors centrally.
- Log chat request duration, response status and token usage.

## Tech stack

| Area | Technologies |
| --- | --- |
| Language | TypeScript |
| Backend | Node.js, Express |
| AI integration | OpenAI SDK, OpenRouter |
| Vector database | ChromaDB |
| Validation | Zod |
| Code quality | ESLint, Prettier |

The study, chat and embedding services use OpenRouter through the OpenAI SDK. Check the service files for the configured model identifiers before running the project. Model availability and pricing depend on the provider.

## Getting started

### Prerequisites

- Node.js and npm compatible with the project's dependencies.
- An OpenRouter API key with access to the configured models.
- Docker for the ChromaDB search endpoint.

### 1. Clone and install

```bash
git clone https://github.com/AthkiaAdiba/genai-study-buddy.git
cd genai-study-buddy
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env`.

**macOS / Linux:**

```bash
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

If `.env.example` is missing, create `.env` in the project root. Set the following values:

```dotenv
PORT=5000
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key
OPENAI_API_KEY=
```

The endpoints described below use `OPENROUTER_API_KEY`. The separate OpenAI client uses `OPENAI_API_KEY`; configure it if you use that client.

Keep `.env` out of Git and never commit API keys. Embedding requests may require paid credits even if the text-generation model is free.

### 3. Start ChromaDB

ChromaDB is required only for `/api/chroma-search`. The client connects to `localhost:8000` without TLS.

Run this command in your terminal, including Windows PowerShell:

```bash
docker run -d --name study-buddy-chroma -p 8000:8000 -v study-buddy-chroma-data:/data chromadb/chroma
```

To restart the existing container later:

```bash
docker start study-buddy-chroma
```

The named volume stores ChromaDB data outside the container. Use a ChromaDB image version compatible with the installed client when maintaining this setup.

### 4. Start the API

```bash
npm run dev
```

Visit [http://localhost:5000/](http://localhost:5000/) to check the server response. If you change `PORT`, use that port in the URL.

To compile and run:

```bash
npm run build
npm start
```

## API endpoints

Default base URL: `http://localhost:5000`.

For POST requests, set `Content-Type: application/json`. You can test these endpoints in Postman using the JSON bodies below.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/` | Check the server response |
| POST | `/api/study/generate` | Generate a topic explanation and quiz |
| POST | `/api/chat` | Chat with client-supplied conversation history |
| POST | `/api/search` | Search the in-memory document index |
| POST | `/api/chroma-search` | Search documents in ChromaDB |

### Generate an explanation and quiz

**POST** `/api/study/generate`

```json
{
  "topic": "JavaScript promises",
  "level": "beginner"
}
```

`topic` is required. `level` defaults to `beginner` and also accepts `intermediate` and `advanced`. The response includes the topic, level, explanation and quiz.

### Chat

**POST** `/api/chat`

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is an embedding?"
    },
    {
      "role": "assistant",
      "content": "An embedding represents content as a numerical vector."
    },
    {
      "role": "user",
      "content": "How does that help with search?"
    }
  ]
}
```

Send at least one message. Each message needs a `user` or `assistant` role and nonempty content. The client supplies the conversation history on each request; the server does not save it between requests.

### Semantic search

**POST** `/api/search`

```json
{
  "query": "How do vector databases find similar text?",
  "limit": 3
}
```

The in-memory endpoint accepts a trimmed query of 1–500 characters and an optional integer `limit` from 1–10. The default limit is 3. Results include document content and similarity scores.

For ChromaDB search, send the same JSON body to **POST** `/api/chroma-search`.

## How search works

Both implementations use sample documents from `src/app/modules/search/search.data.ts`.

### In-memory search

1. The first search request generates embeddings for the sample documents.
2. The server caches those vectors in memory until the process stops.
3. Each search query is converted into an embedding.
4. A custom cosine similarity calculation compares the query vector with the document vectors.
5. The endpoint returns the closest matches.

### ChromaDB search

The service uses the `study_documents` collection with cosine distance. When the collection is empty, it adds the sample documents and their embeddings. It then searches the collection using the query embedding.

Editing the sample data file does not automatically update a populated ChromaDB collection. Update or reseed the collection to reflect those changes.

## Project structure

```text
src/
  app.ts
  server.ts
  app/
    ai/clients/
    config/
    errors/
    interface/
    middlewares/
    modules/
      study/
      chat/
      search/
      chroma-search/
    routes/
    utils/
```

Each feature separates its routes, controllers, services and validation schemas.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with file watching |
| `npm run build` | Compile TypeScript |
| `npm start` | Run the compiled server |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Apply available ESLint fixes |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting |

Automated tests are not configured. The current `npm test` script is a placeholder that exits with an error.

## Current limitations

- This project currently provides a backend API.
- Search and answer generation are separate. Retrieved documents are not passed into the chat or study prompts, so the project does not yet implement a complete retrieval-augmented generation (RAG) pipeline.
- Chat history is supplied by the client and is not persisted by the server.
- Search uses sample documents rather than user-uploaded material.
- Authentication and rate limiting are not implemented. Add them before making endpoints that use paid API keys publicly accessible.

## Planned improvements

- Add PostgreSQL with pgvector for vector storage and search.
- Connect document retrieval to answer generation to build a RAG pipeline.
- Explore LangChain for retrieval and model workflows.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Model request fails | Check the API key, account credits and configured model availability. |
| ChromaDB connection fails | Check that Docker and the container are running and port 8000 is reachable. |
| Sample document changes do not appear | Update or reseed the ChromaDB collection. |
| Server URL does not respond | Check the terminal output and the `PORT` value in `.env`. |

## Author

**Athkia Adiba Tonne**

- [GitHub](https://github.com/AthkiaAdiba)
- [Portfolio](https://my-portfolio-new-nine.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/athkia-adiba-tonne/)

