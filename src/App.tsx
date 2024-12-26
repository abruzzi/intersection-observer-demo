import "./App.css";
import { Fragment, useEffect, useRef } from "react";
import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import { getQuotesPaginated, PaginatedQuotes } from "./getQuotes.ts";

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

function App() {
  const ref = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLLIElement | null>(null);

  const { data, fetchNextPage, hasNextPage } =
    useInfiniteQuery<PaginatedQuotes>({
      queryKey: ["quotes"],
      queryFn: async ({ pageParam = 1 }) => getQuotesPaginated(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage: PaginatedQuotes): number | undefined => {
        return lastPage.meta.hasMore
          ? Number(lastPage.meta.currentPage) + 1
          : undefined;
      },
    });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const options = {
      root: ref.current as HTMLDivElement,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.className.includes("trigger") && hasNextPage) {
            fetchNextPage();
          }
        }
      });
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
        {data?.pages.map((page, pageIndex) => (
          <Fragment key={pageIndex}>
            {page.quotes.map((quote) => (
              <li key={quote.id} className="list-item">
                {quote.text} - {quote.author}
              </li>
            ))}
          </Fragment>
        ))}
        <li className="trigger" ref={triggerRef}>
          {hasNextPage ? "Load more..." : ""}
        </li>
      </ol>
    </div>
  );
}

export default App;
