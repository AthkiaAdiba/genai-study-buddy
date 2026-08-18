export type TSearchDocument = {
  id: string;
  title: string;
  content: string;
};

export type TEmbeddedDocument = TSearchDocument & {
  embedding: number[];
};

export type TSearchRequest = {
  query: string;
  limit?: number;
};

export type TSearchResult = TSearchDocument & {
  similarity: number;
};

export type TSearchResponse = {
  query: string;
  results: TSearchResult[];
};
