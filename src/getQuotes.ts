type Quote = {
  id: number;
  text: string;
  author: string;
}

export const getQuotes = () => {
  return fetch("http://localhost:3000/quotes")
    .then((r) => r.json())
};
