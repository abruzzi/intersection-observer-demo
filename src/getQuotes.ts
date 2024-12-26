type Quote = {
  id: number;
  text: string;
  author: string;
}

type Meta = {
  currentPage: number;
  hasMore: boolean;
  pageSize: number;
  total: number;
}

export type PaginatedQuotes = {
  meta: Meta;
  quotes: Quote[]
}

export const getQuotes = () => {
  return fetch<Quote[]>("http://localhost:3000/quotes")
    .then((r) => r.json())
};

export const getQuotesPaginated = (page: number = 1) => {
  return fetch<PaginatedQuotes>(`http://localhost:3000/quotes/paginated?page=${page}`)
    .then((r) => r.json())
};
