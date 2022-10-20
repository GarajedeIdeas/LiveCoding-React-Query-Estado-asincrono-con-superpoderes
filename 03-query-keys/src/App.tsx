import { ReactElement, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function fetchUsers({ queryKey }) {
  const [_key, page] = queryKey;
  return fetch(`https://reqres.in/api/users?page=${page}`).then((res) =>
    res.json()
  );
}

function Users(): ReactElement {
  const [page, setPage] = useState(1);
  const { isLoading, error, data } = useQuery(["users", page], fetchUsers);

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
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
      <div>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>
        <button
          disabled={page === data.total_pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
}
