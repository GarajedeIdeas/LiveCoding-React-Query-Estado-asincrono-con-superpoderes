import { useQuery } from "@tanstack/react-query";
import { ReactElement, useState } from "react";

function fetchUsers({ queryKey }) {
  const [_key, page] = queryKey;
  return fetch(`https://reqres.in/api/users?page=${page}`).then((res) =>
    res.json()
  );
}

export default function Users({ onClick }): ReactElement {
  const [page, setPage] = useState(1);
  const { isLoading, error, data, isPreviousData } = useQuery(
    ["users", page],
    fetchUsers,
    {
      keepPreviousData: true
    }
  );

  if (isLoading) {
    return <div>Cargando</div>;
  }

  if (error) {
    return <div>{error instanceof Error ? error.message : "Error"}</div>;
  }

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {data.data.map((user) => (
          <li key={user.id} onClick={() => onClick(user.id)}>
            {user.email}
          </li>
        ))}
      </ul>
      <div>
        <p>Página: {page}</p>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <button
          disabled={page === data.total_pages || isPreviousData}
          onClick={() => {
            if (!isPreviousData) {
              setPage((p) => p + 1);
            }
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
