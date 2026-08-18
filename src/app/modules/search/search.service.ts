import openRouterClient from '../../ai/clients/openRouter.client';
import { searchDocuments } from './search.data';
import type {
  TEmbeddedDocument,
  TSearchRequest,
  TSearchResponse,
  TSearchResult,
} from './search.interface';

const EMBEDDING_MODEL = 'openai/text-embedding-3-small';

let embeddedDocumentsPromise: Promise<TEmbeddedDocument[]> | null = null;

/**
 * Sends one or more pieces of text to the embedding model.
 *
 * The returned array follows the same order as the input array:
 *
 * inputs[0] -> embeddings[0]
 * inputs[1] -> embeddings[1]
 */
const generateEmbeddings = async (inputs: string[]): Promise<number[][]> => {
  if (inputs.length === 0) {
    return [];
  }

  const response = await openRouterClient.embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
    encoding_format: 'float',
  });

  const orderedEmbeddings = [...response.data].sort(
    (firstItem, secondItem) => firstItem.index - secondItem.index,
  );

  if (orderedEmbeddings.length !== inputs.length) {
    throw new Error('The embedding API returned an unexpected result!');
  }

  return orderedEmbeddings.map((item) => item.embedding);
};

/**
 * Generates embeddings for all searchable documents.
 *
 * This happens only once while the server is running.
 */
const buildEmbeddedDocumentIndex = async (): Promise<TEmbeddedDocument[]> => {
  const documentContents = searchDocuments.map(
    (document) => `${document.title}\n${document.content}`,
  );

  const embeddings = await generateEmbeddings(documentContents);

  return searchDocuments.map((document, index): TEmbeddedDocument => {
    const embedding = embeddings[index];

    if (!embedding) {
      throw new Error(
        `Embedding was not generated for document: ${document.id}`,
      );
    }

    return {
      ...document,
      embedding,
    };
  });
};

/**
 * Returns the existing in-memory index.
 *
 * If the index does not exist, it creates it first.
 */
const getEmbeddedDocumentIndex = async (): Promise<TEmbeddedDocument[]> => {
  if (!embeddedDocumentsPromise) {
    embeddedDocumentsPromise = buildEmbeddedDocumentIndex().catch(
      (error: unknown) => {
        embeddedDocumentsPromise = null;
        throw error;
      },
    );
  }

  return embeddedDocumentsPromise;
};

/**
 * Calculates cosine similarity between two vectors.
 *
 * Formula:
 *
 * dot product / (magnitude of A * magnitude of B)
 */
const calculateCosineSimilarity = (
  firstVector: number[],
  secondVector: number[],
): number => {
  if (firstVector.length !== secondVector.length) {
    throw new Error('Cannot compare embeddings with different dimensions!');
  }

  let dotProduct = 0;

  for (let index = 0; index < firstVector.length; index += 1) {
    const firstValue = firstVector[index];
    const secondValue = secondVector[index];

    if (firstValue === undefined || secondValue === undefined) {
      throw new Error(`Missing vector value at index ${index}!`);
    }

    dotProduct += firstValue * secondValue;
  }

  const firstMagnitude = Math.sqrt(
    firstVector.reduce(
      (total, currentValue) => total + currentValue * currentValue,
      0,
    ),
  );

  const secondMagnitude = Math.sqrt(
    secondVector.reduce(
      (total, currentValue) => total + currentValue * currentValue,
      0,
    ),
  );

  if (firstMagnitude === 0 || secondMagnitude === 0) {
    return 0;
  }

  return dotProduct / (firstMagnitude * secondMagnitude);
};

const searchSimilarDocuments = async (
  payload: TSearchRequest,
): Promise<TSearchResponse> => {
  const query = payload.query.trim();

  // We protect the service even if validation middleware is bypassed.
  const limit = Math.min(Math.max(payload.limit ?? 3, 1), 10);

  const embeddedDocuments = await getEmbeddedDocumentIndex();

  const queryEmbeddings = await generateEmbeddings([query]);

  const queryEmbedding = queryEmbeddings[0];

  if (!queryEmbedding) {
    throw new Error('The embedding model did not return a query embedding!');
  }

  const results: TSearchResult[] = embeddedDocuments
    .map((document) => {
      const { embedding, ...searchDocument } = document;

      const similarity = calculateCosineSimilarity(queryEmbedding, embedding);

      return {
        ...searchDocument,
        similarity: Number(similarity.toFixed(4)),
      };
    })
    .sort(
      (firstResult, secondResult) =>
        secondResult.similarity - firstResult.similarity,
    )
    .slice(0, limit);

  return {
    query,
    results,
  };
};

export const SearchServices = {
  searchSimilarDocuments,
};
