import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import listInfo from "./listInfo";

function fetchTaskById({ id }) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(listInfo.list.find((d) => d.id === id));
    }, 200);
  });
}

function patchTask(task) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      listInfo.list = listInfo.list.map(function (d) {
        if (d.id === task.id) {
          return task;
        }
        return d;
      });
      resolve(task);
    }, 1000);
  });
}

export default function EditTask({ editingIndex, setEditingIndex }) {
  const queryClient = useQueryClient();

  const { status, data, isFetching, error, refetch } = useQuery(
    ["task", { id: editingIndex }],
    () => fetchTaskById({ id: editingIndex }),
    {
      enabled: editingIndex !== null
    }
  );

  const [task, setTask] = useState(data || {});

  useEffect(
    function () {
      if (editingIndex !== null && data) {
        setTask(data);
      } else {
        setTask({});
      }
    },
    [data, editingIndex]
  );

  const saveMutation = useMutation(patchTask, {
    onSuccess: function (data) {
      queryClient.invalidateQueries(["tasks"]);
      queryClient.setQueryData(["task", { id: editingIndex }], data);
    }
  });

  function onSave() {
    saveMutation.mutate(task);
  }

  const disableEditSave =
    status === "loading" || saveMutation.status === "loading";

  return (
    <div>
      <div>
        {data ? (
          <>
            <button onClick={() => setEditingIndex(null)}>Back</button> Editing
            Task "{data.name}" (#
            {editingIndex})
          </>
        ) : null}
      </div>
      {status === "loading" ? (
        <span>Loading... </span>
      ) : error ? (
        <span>
          Error! <button onClick={() => refetch()}>Retry</button>
        </span>
      ) : (
        <>
          <label>
            Name:{" "}
            <input
              value={task.name ?? ""}
              onChange={(e) =>
                setTask((old) => ({ ...old, name: e.target.value }))
              }
              disabled={disableEditSave}
            />
          </label>
          <label>
            Notes:{" "}
            <input
              value={task.notes ?? ""}
              onChange={(e) =>
                setTask((old) => ({ ...old, notes: e.target.value }))
              }
              disabled={disableEditSave}
            />
          </label>
          <div>
            <button onClick={onSave} disabled={disableEditSave}>
              Save
            </button>
          </div>
          <div>
            {saveMutation.status === "loading"
              ? "Saving..."
              : saveMutation.status === "error"
              ? saveMutation.error.message
              : saveMutation.status === "success"
              ? "Saved!"
              : ""}
          </div>
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
