import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import listInfo from "./listInfo";

function postTask({ name, notes }) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      listInfo.id = listInfo.id + 1;
      const task = { name, notes, id: listInfo.id };
      listInfo.list = [...listInfo.list, task];
      resolve(task);
    }, 300);
  });
}

export default function AddTask() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const addMutation = useMutation(postTask, {
    onSuccess: function (response) {
      queryClient.invalidateQueries(["tasks"]);
      /*queryClient.setQueryData(["tasks"], function (old) {
        console.log(old);
        return [...old, response];
      });*/
    }
  });

  function addTask() {
    addMutation.mutate({ name });
  }

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={addMutation.status === "loading"}
      />
      <button
        onClick={addTask}
        disabled={addMutation.status === "loading" || !name}
      >
        Add task
      </button>
      <div>
        {addMutation.status === "loading"
          ? "Saving..."
          : addMutation.status === "error"
          ? addMutation.error.message
          : addMutation.status === "success"
          ? "Saved!"
          : ""}
      </div>
    </div>
  );
}
