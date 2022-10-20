import { ReactElement, Suspense } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true
    }
  }
});

function Users(): ReactElement {
  const { data } = useQuery(
    ["users"],
    () =>
      new Promise((resolve) => setTimeout(() => resolve(), 5000))
        .then(() => fetch("https://reqres.in/api/users?page=2"))
        .then((res) => res.json()),
    { suspense: true }
  );

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
    <Suspense fallback="Cargando...">
      <QueryClientProvider client={queryClient}>
        <Users />
      </QueryClientProvider>
    </Suspense>
  );
}
