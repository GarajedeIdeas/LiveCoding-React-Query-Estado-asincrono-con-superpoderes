import { useQuery } from "@tanstack/react-query";
import { ReactElement } from "react";

export default function User({ userId }): ReactElement | null {
  const { isLoading, error, data, fetchStatus } = useQuery(
    ["user", userId],
    () =>
      fetch(`https://reqres.in/api/users/${userId}`).then((res) => res.json()),
    {
      enabled: Boolean(userId)
    }
  );

  if (fetchStatus === "fetching") {
    return <div>Cargando</div>;
  }

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div>{error instanceof Error ? error.message : "Error"}</div>;
  }

  return (
    <div>
      <h1>{data.data.email}</h1>
    </div>
  );
}
