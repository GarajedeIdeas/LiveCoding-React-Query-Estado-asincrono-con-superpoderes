import { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./styles.css";

let id = 0;
let list = [
  "apple",
  "banana",
  "pineapple",
  "grapefruit",
  "dragonfruit",
  "grapes"
].map((d) => ({ id: id++, name: d, notes: "These are some notes" }));

let queryTimeMin = 1000;
let queryTimeMax = 2000;

const queryClient = new QueryClient();

export default function App() {
  const [staleTime, setStaleTime] = useState(1000);
  const [cacheTime, setCacheTime] = useState(3000);

  useEffect(() => {
    queryClient.setDefaultOptions({
      queries: {
        staleTime,
        cacheTime
      }
    });
  }, [cacheTime, staleTime]);

  return (
    <QueryClientProvider client={queryClient}>
      <p>
        The "staleTime" and "cacheTime" durations have been altered in this
        example to show how query stale-ness and query caching work on a
        granular level
      </p>
      <div>
        Stale Time:{" "}
        <input
          type="number"
          min="0"
          step="1000"
          value={staleTime}
          onChange={(e) => setStaleTime(parseFloat(e.target.value, 10))}
          style={{ width: "100px" }}
        />
      </div>
      <div>
        Cache Time:{" "}
        <input
          type="number"
          min="0"
          step="1000"
          value={cacheTime}
          onChange={(e) => setCacheTime(parseFloat(e.target.value, 10))}
          style={{ width: "100px" }}
        />
      </div>
      <br />
      <br />
      <Fruits />
      <br />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

const views = ["", "fruit", "grape"];

function Fruits() {
  const queryClient = useQueryClient();

  return (
    <div>
      <div>
        <button onClick={() => queryClient.invalidateQueries()}>
          Force Refetch All
        </button>
      </div>
      <br />
      <hr />
      {views.map((view, index) => (
        <div key={index}>
          <Todos initialFilter={view} />
          <br />
        </div>
      ))}
    </div>
  );
}

function Todos({ initialFilter = "" }) {
  const [filter, setFilter] = useState(initialFilter);

  const { status, data, isFetching, error, failureCount, refetch } = useQuery(
    ["todos", { filter }],
    fetchTodos
  );

  return (
    <div>
      <div>
        <label>
          Filter:{" "}
          <input value={filter} onChange={(e) => setFilter(e.target.value)} />
        </label>
      </div>
      {status === "loading" ? (
        <span>Loading... (Attempt: {failureCount + 1})</span>
      ) : status === "error" ? (
        <span>
          Error: {error.message}
          <br />
          <button onClick={() => refetch()}>Retry</button>
        </span>
      ) : (
        <>
          <ul>
            {data
              ? data.map((todo) => <li key={todo.id}>{todo.name} </li>)
              : null}
          </ul>
          <div>
            {isFetching ? (
              <span>
                Background Refreshing... (Attempt: {failureCount + 1})
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function fetchTodos({ signal, queryKey: [, { filter }] }) {
  console.info("fetchTodos", { filter });

  if (signal) {
    signal.addEventListener("abort", () => {
      console.info("cancelled", filter);
    });
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(list.filter((d) => d.name.includes(filter)));
    }, queryTimeMin + Math.random() * (queryTimeMax - queryTimeMin));
  });
}
