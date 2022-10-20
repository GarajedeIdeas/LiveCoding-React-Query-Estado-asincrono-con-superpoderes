import { ReactElement, Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function fetchCharacters({
  pageParam = "https://swapi.dev/api/people/?page=1"
}) {
  return fetch(pageParam).then((res) => res.json());
}

export default function Users(): ReactElement {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isLoading
  } = useInfiniteQuery(["characters"], fetchCharacters, {
    getNextPageParam: (lastPage, pages) => lastPage.next
  });

  if (isLoading) {
    return <div>Cargando</div>;
  }

  if (status === "error") {
    return <div>{error instanceof Error ? error.message : "Error"}</div>;
  }

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {data.pages.map((group, i) => (
          <Fragment key={i}>
            {group.results.map((character) => (
              <p key={character.url}>{character.name}</p>
            ))}
          </Fragment>
        ))}
      </ul>
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Cargando más"
            : hasNextPage
            ? "Cargar más"
            : "Final"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </div>
  );
}
