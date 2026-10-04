# GenAI Study Buddy

A backend learning project built with Node.js, Express and TypeScript. It generates study explanations and quizzes, supports chat with client-supplied conversation history, and searches sample study documents using embeddings.

## Features

- Topic explanations for beginner, intermediate and advanced learners, with three follow-up quiz questions.
- Chat that passes the supplied user and assistant messages to the model.
- In-memory semantic search with a custom cosine similarity calculation.
- ChromaDB storage and retrieval of documents, metadata and embeddings.
- Request validation with Zod and centralized error handling.
- Chat response logging for duration, status and token usage.

## Stack

Node.js, TypeScript, Express, OpenAI SDK, OpenRouter, ChromaDB and Zod. ESLint and Prettier provide code checks and formatting.

The active study, chat and embedding services use OpenRouter through the OpenAI SDK. Embeddings use `openai/text-embedding-3-small`; study and chat currently use `poolside/laguna-xs-2.1:free`. Model names are defined in the service files.

## Local setup

### Requirements

- A recent Node.js version compatible with the dependencies and npm.
- An OpenRouter API key with access to the configured models.
- Docker, if you want to run the ChromaDB search endpoint locally.

### Install

```bash
git clone https://github.com/AthkiaAdiba/genai-study-buddy.git
cd genai-study-buddy
npm ci
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Set these values in `.env`:

```dotenv
PORT=5000
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is included for the separate OpenAI client; the active endpoints described here use `OPENROUTER_API_KEY`. Keep credentials out of source control. Embedding requests may require paid API credits even when the text-generation model is free.

### Start ChromaDB

ChromaDB is only required for `/api/chroma-search`. Its client is configured for `localhost:8000` without TLS.

```bash
docker run -d --name study-buddy-chroma -p 8000:8000 -v study-buddy-chroma-data:/data chromadb/chroma
```

For subsequent runs, start the existing container with `docker start study-buddy-chroma`. The named volume retains its data.

### Run the API

```bash
npm run dev
```

Open `http://localhost:5000/` to check that the server is running.

For compiled execution:

```bash
npm run build
npm start
```

## API endpoints

Base URL: `http://localhost:5000`. POST requests use `Content-Type: application/json`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Server status message |
| POST | `/api/study/generate` | Generate an explanation and quiz |
| POST | `/api/chat` | Chat using supplied conversation messages |
| POST | `/api/search` | Search the in-memory document index |
| POST | `/api/chroma-search` | Search documents stored in ChromaDB |

### Study explanation and quiz

```bash
curl -X POST http://localhost:5000/api/study/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript promises","level":"beginner"}'
```

`topic` is required. `level` is optional and defaults to `beginner`; other accepted values are `intermediate` and `advanced`. The returned data includes the topic, level, explanation and quiz.

### Chat

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is an embedding?"},{"role":"assistant","content":"An embedding represents content as a numerical vector."},{"role":"user","content":"How does that help with search?"}]}'
```

Send at least one message. Each message requires a `user` or `assistant` role and nonempty content. The client must supply conversation history on each request; the server does not persist it.

### Semantic search

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"How do vector databases find similar text?","limit":3}'
```

For the ChromaDB version, send the same body to `/api/chroma-search`.

The in-memory search validates a trimmed query of 1–500 characters and an optional integer `limit` from 1–10. The default limit is 3. Results include document content and similarity scores.

Examples above use POSIX shell syntax. On Windows, use Postman with the same JSON bodies, or adapt the quoting for your shell.

## How retrieval works

Both search implementations use the sample documents in `src/app/modules/search/search.data.ts`.

The in-memory implementation creates document embeddings on the first search request and caches them for the lifetime of the server process. Each query is embedded and compared with the document vectors using cosine similarity.

The ChromaDB implementation uses the `study_documents` collection with cosine distance. It seeds the sample documents when the collection is empty, then queries it using the query embedding. Changes to the sample documents are not automatically synchronized into a populated collection.

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

Routes, controllers, services and validation schemas are separated by feature.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with file watching |
| `npm run build` | Compile TypeScript |
| `npm start` | Run the compiled server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Apply available ESLint fixes |
| `npm run format` | Format files with Prettier |
| `npm run format:check` | Check formatting |

Automated tests have not been configured. The current `npm test` command is a placeholder that exits with an error.

## Current scope and next steps

This is a backend learning project. Retrieval and answer generation are separate: retrieved documents are not yet passed into the chat or study prompts, so a complete retrieval-augmented generation pipeline is not implemented.

Planned learning areas include pgvector, retrieval-augmented generation and LangChain. The current API has no authentication or rate limiting; add these controls before exposing endpoints backed by paid API keys.

If a model becomes unavailable, update the model identifier in the relevant service. If ChromaDB search fails, check that the container is running and reachable on port 8000.

## Author

Athkia Adiba Tonne

- [GitHub](https://github.com/AthkiaAdiba)
- [Portfolio](https://my-portfolio-new-nine.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/athkia-adiba-tonne/)

