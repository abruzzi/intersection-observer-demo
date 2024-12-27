import "./App.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

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

  const { data, hasNextPage, fetchNextPage } =
    useInfiniteQuery<PaginatedQuotes>({
      queryKey: ["quotes"],
      queryFn: ({ pageParam = 1 }) => fetchQuotes(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage: PaginatedQuotes) => {
        if (lastPage.meta.hasMore) {
          return Number(lastPage.meta.currentPage) + 1;
        } else {
          return undefined;
        }
      },
    });

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
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    }, options);

    if (triggerRef.current) {
      observer.observe(triggerRef.current as HTMLLIElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage]);

  return (
    <div className="container" ref={ref}>
      <ol>
        {data?.pages?.map((page, index) => {
          return (
            <Fragment key={index}>
              {page.quotes.map((quote) => (
                <li key={quote.id} className="list-item">
                  {quote.text} - {quote.author}
                </li>
              ))}
            </Fragment>
          );
        })}

        <li className="trigger" ref={triggerRef}>
          {hasNextPage ? "Load more..." : ""}
        </li>
      </ol>
    </div>
  );
}

export default App;
