import { ReactElement } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function Users(): ReactElement {
  const { isLoading, error, data } = useQuery(["users"], () =>
    fetch("https://reqres.in/api/users?page=2").then((res) => res.json())
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
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
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
