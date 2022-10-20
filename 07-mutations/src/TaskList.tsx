import { useQuery } from "@tanstack/react-query";
import listInfo from "./listInfo";

function fetchTasks() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(listInfo.list);
    }, 600);
  });
}

export default function TaskList({ setEditingIndex }) {
  const { status, data, isFetching, error, refetch } = useQuery(
    ["tasks"],
    fetchTasks
  );

  return (
    <div>
      {status === "loading" ? (
        <span>Loading... </span>
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
              ? data.map((task) => (
                  <li key={task.id}>
                    {task.name}{" "}
                    <button onClick={() => setEditingIndex(task.id)}>
                      Edit
                    </button>
                  </li>
                ))
              : null}
          </ul>
          <div>
            {isFetching ? (
              <span>Background Refreshing...</span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
