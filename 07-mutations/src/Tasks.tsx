import { useState } from "react";
import TaskList from "./TaskList";
import EditTask from "./EditTask";
import AddTask from "./AddTask";

export default function Tasks() {
  const [editingIndex, setEditingIndex] = useState(null);

  return (
    <div className="App">
      <TaskList setEditingIndex={setEditingIndex} />
      <br />
      <hr />
      {editingIndex !== null ? (
        <>
          <EditTask
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
          />
          <hr />
        </>
      ) : null}
      <AddTask />
    </div>
  );
}
