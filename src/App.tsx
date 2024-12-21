import "./App.css";
import { useEffect, useRef } from "react";

const quotes = [
  "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
  "Do what you can, with what you have, where you are. – Theodore Roosevelt",
  "Don’t count the days, make the days count. – Muhammad Ali",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "Success is walking from failure to failure with no loss of enthusiasm. – Winston Churchill",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. – Ralph Waldo Emerson",
  "You miss 100% of the shots you don’t take. – Wayne Gretzky",
  "Strive not to be a success, but rather to be of value. – Albert Einstein",
  "Dream big and dare to fail. – Norman Vaughan",
];

function App() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const options = {
      root: ref.current as Element,
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          console.log(element.innerHTML);

          if (element.className.includes("trigger")) {
            console.log("loading more quotes from server");
          }

          observer.unobserve(element);
        }
      });
    }, options);

    const listItems = document.querySelectorAll(".list-item");
    listItems.forEach((item) => {
      observer.observe(item);
    });

    const trigger = document.querySelector(".trigger");
    observer.observe(trigger);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container" ref={ref}>
      <ol>
        <ol>
          {quotes.map((quote) => (
            <li key={quote} className="list-item">
              {quote}
            </li>
          ))}
          <li className="trigger">Loading...</li>
        </ol>
      </ol>
    </div>
  );
}

export default App;
