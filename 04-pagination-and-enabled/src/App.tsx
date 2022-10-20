import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import User from "./User";
import Users from "./Users";

const queryClient = new QueryClient();

export default function App() {
  const [userId, setUserId] = useState(null);
  return (
    <QueryClientProvider client={queryClient}>
      <Users onClick={(userId) => setUserId(userId)} />
      <User userId={userId} />
    </QueryClientProvider>
  );
}
