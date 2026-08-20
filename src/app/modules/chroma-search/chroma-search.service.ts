import chromaClient from '../../ai/clients/chroma.client';
import openRouterClient from '../../ai/clients/openRouter.client';
import { searchDocuments } from '../search/search.data';
import type {
  TChromaSearchRequest,
  TChromaSearchResponse,
  TChromaSearchResult,
} from './chroma-search.interface';

const EMBEDDING_MODEL = 'openai/text-embedding-3-small';

const COLLECTION_NAME = 'study_documents';

const generateEmbeddings = async (
  texts: string[],
): Promise<number[][]> => {
  const response = await openRouterClient.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map((item) => item.embedding);
};

const initializeChromaCollection = async () => {
  const collection = await chromaClient.getOrCreateCollection({
    name: COLLECTION_NAME,
    embeddingFunction: null,
    configuration: {
      hnsw: {
        space: 'cosine',
      },
    },
  });

  const numberOfStoredDocuments = await collection.count();

  if (numberOfStoredDocuments === 0) {
    const textsToEmbed = searchDocuments.map(
      (document) => `${document.title}\n\n${document.content}`,
    );

    const documentEmbeddings = await generateEmbeddings(textsToEmbed);

    await collection.upsert({
      ids: searchDocuments.map((document) => document.id),

      documents: searchDocuments.map((document) => document.content),

      metadatas: searchDocuments.map((document) => ({
        title: document.title,
      })),

      embeddings: documentEmbeddings,
    });
  }

  return collection;
};

let collectionPromise:
  | ReturnType<typeof initializeChromaCollection>
  | null = null;

const getChromaCollection = () => {
  if (!collectionPromise) {
    collectionPromise = initializeChromaCollection().catch(
      (error: unknown) => {
        collectionPromise = null;
        throw error;
      },
    );
  }

  return collectionPromise;
};

const searchSimilarDocuments = async (
  payload: TChromaSearchRequest,
): Promise<TChromaSearchResponse> => {
  const query = payload.query.trim();

  const limit = Math.min(
    Math.max(payload.limit ?? 3, 1),
    10,
  );

  const collection = await getChromaCollection();

  const [queryEmbedding] = await generateEmbeddings([query]);

  if (!queryEmbedding) {
    throw new Error('The query embedding could not be generated.');
  }

  const queryResponse = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: Math.min(limit, searchDocuments.length),
    include: ['documents', 'metadatas', 'distances'],
  });

  console.log(queryResponse)

  const ids = queryResponse.ids[0] ?? [];
  const documents = queryResponse.documents?.[0] ?? [];
  const metadatas = queryResponse.metadatas?.[0] ?? [];
  const distances = queryResponse.distances?.[0] ?? [];

  const results: TChromaSearchResult[] = ids.map(
    (id, index) => {
      const metadata = metadatas[index];
      const distance = distances[index];

      const title =
        metadata && typeof metadata.title === 'string'
          ? metadata.title
          : 'Untitled';

      const similarity =
        typeof distance === 'number' ? 1 - distance : 0;

      return {
        id,
        title,
        content: documents[index] ?? '',
        similarity,
      };
    },
  );

  return {
    query,
    results,
  };
};

export const ChromaSearchServices = {
  searchSimilarDocuments,
};