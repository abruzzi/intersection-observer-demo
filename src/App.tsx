import './App.css'
import {useEffect, useRef} from "react";

function App() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(ref.current === null) {
      return;
    }

    const options = {
      root: ref.current as Element,
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const element = entry.target;
          console.log(element.innerHTML);
          observer.unobserve(element);
          if(element.className.includes("last")) {
            console.log('loading more quotes from server');
          }
        }
      })
    }, options);

    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container" ref={ref}>
      <ol>
        <li className="list-item">"The only limit to our realization of tomorrow will be our doubts of today." – Franklin D. Roosevelt</li>
        <li className="list-item">"Do what you can, with what you have, where you are." – Theodore Roosevelt</li>
        <li className="list-item">"Don’t count the days, make the days count." – Muhammad Ali</li>
        <li className="list-item">"Hardships often prepare ordinary people for an extraordinary destiny." – C.S. Lewis</li>
        <li className="list-item">"Success is walking from failure to failure with no loss of enthusiasm." – Winston Churchill</li>
        <li className="list-item">"It does not matter how slowly you go as long as you do not stop." – Confucius</li>
        <li className="list-item">"What lies behind us and what lies before us are tiny matters compared to what lies within us." – Ralph Waldo Emerson</li>
        <li className="list-item">"You miss 100% of the shots you don’t take." – Wayne Gretzky</li>
        <li className="list-item">"Strive not to be a success, but rather to be of value." – Albert Einstein</li>
        <li className="list-item">"Dream big and dare to fail." – Norman Vaughan</li>
        <li className="list-item last">Loading...</li>
      </ol>
    </div>
  )
}

export default App
