import "./App.css";
import { useEffect, useRef, useState } from "react";

const quotes = [
  "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
  "Do what you can, with what you have, where you are. – Theodore Roosevelt",
  "Don’t count the days, make the days count. – Muhammad Ali",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "Success is walking from failure to failure with no loss of enthusiasm. – Winston Churchill",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "Strive not to be a success, but rather to be of value. – Albert Einstein",
  "Dream big and dare to fail. – Norman Vaughan",
];

type Quote = {
  id: number;
  text: string;
  author: string;
};

type Meta = {
  currentPage: number;
  hasMore: boolean;
  pageSize: number;
  total: number;
};

type PaginatedQuotes = {
  meta: Meta;
  quotes: Quote[];
};

const fetchQuotes = async (page: number = 1): Promise<PaginatedQuotes> => {
  return fetch(`http://localhost:3000/quotes/paginated?page=${page}`).then(
    (r) => r.json()
  );
};

function App() {
  const ref = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLLIElement | null>(null);
  const [quoteList, setQuoteList] = useState<Quote[]>([]);

  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);

  const fetchNext = async () => {
    const { meta, quotes } = await fetchQuotes(page.current);
    setQuoteList(quoteList => [...quoteList, ...quotes]);

    if(meta.hasMore) {
      page.current = page.current + 1;
    }

    hasMore.current = meta.hasMore;
  };

  useEffect(() => {
    fetchNext();
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const options = {
      root: ref.current as HTMLDivElement,
      rootMargin: "0px",
      threshold: 1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore.current) {
        fetchNext();
      }
    }, options);

    if (triggerRef.current) {
      observer.observe(triggerRef.current as HTMLLIElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="container" ref={ref}>
      <ol>
        {quoteList.map((quote) => (
          <li key={quote.id} className="list-item">
            {quote.text} - {quote.author}
          </li>
        ))}
        <li className="trigger" ref={triggerRef}>
          Load more...
        </li>
      </ol>
    </div>
  );
}

export default App;
