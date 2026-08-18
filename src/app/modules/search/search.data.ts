import type { TSearchDocument } from './search.interface';

export const searchDocuments: TSearchDocument[] = [
  {
    id: 'doc-1',
    title: 'Retrieval-Augmented Generation',
    content:
      'Retrieval-Augmented Generation, or RAG, retrieves relevant information from an external knowledge source and gives that information to a language model before it generates an answer.',
  },
  {
    id: 'doc-2',
    title: 'Text Embeddings',
    content:
      'A text embedding is a numerical vector that represents the semantic meaning of text. Texts with similar meanings normally have embeddings that are close to each other.',
  },
  {
    id: 'doc-3',
    title: 'Vector Databases',
    content:
      'A vector database stores embeddings and searches for vectors that are closest to a query vector. Vector databases are commonly used for semantic search, recommendations, and RAG applications.',
  },
  {
    id: 'doc-4',
    title: 'Cosine Similarity',
    content:
      'Cosine similarity measures the similarity between two vectors by comparing the angle between them. A higher cosine similarity score normally means that two pieces of text have more similar meanings.',
  },
  {
    id: 'doc-5',
    title: 'Context Window',
    content:
      'A context window is the maximum amount of input and output information that a language model can process during one request. Conversation history also uses space inside the context window.',
  },
  {
    id: 'doc-6',
    title: 'Prompt Engineering',
    content:
      'Prompt engineering is the process of designing clear instructions and context that help a generative AI model produce a useful response.',
  },
  {
    id: 'doc-7',
    title: 'AI Hallucinations',
    content:
      'An AI hallucination happens when a generative AI model produces information that sounds confident but is incorrect or unsupported by reliable evidence.',
  },
  {
    id: 'doc-8',
    title: 'Conversation History',
    content:
      'A language model does not automatically remember previous HTTP requests. A chat application usually sends previous user and assistant messages with the new request to preserve conversation context.',
  },
];
