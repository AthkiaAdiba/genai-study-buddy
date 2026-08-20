export type TChromaSearchRequest = {
  query: string;
  limit?: number;
};

export type TChromaSearchResult = {
  id: string;
  title: string;
  content: string;
  similarity: number;
};

export type TChromaSearchResponse = {
  query: string;
  results: TChromaSearchResult[];
};