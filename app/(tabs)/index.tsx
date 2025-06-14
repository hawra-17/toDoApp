import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import TaskList from "../../component/TaskList";
import TaskInput from "../../component/TaskInput";

export default function index() {
  const [task, setTask] = useState<string>("");
  const [taskItems, setTaskItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null); // it's check if it's null so new task if not edit the task with this index

  const addTask = () => {
    if (!task.trim()) return;

    if (editIndex !== null) {
      const updatedTasks = [...taskItems];
      updatedTasks[editIndex] = task;
      setTaskItems(updatedTasks);
      setEditIndex(null); // Exit edit mode
    } else {
      setTaskItems([...taskItems, task]);
      setCheckedItems([...checkedItems, false]);
    }

    setTask(""); // Clear input
    Keyboard.dismiss();
  };

  const deleteTask = (index: number) => {
    const copyTask = [...taskItems];
    const copyCheckedItems = [...checkedItems];
    copyTask.splice(index, 1);
    copyCheckedItems.splice(index, 1);
    setTaskItems(copyTask);
    setCheckedItems(copyCheckedItems);
  };

  const startEdit = (index: number) => {
    setTask(taskItems[index]); // Load task text into input
    setEditIndex(index); // Remember which task is being edited
  };

  const toggleCheck = (index: number) => {
    const updatedChecks = [...checkedItems];
    updatedChecks[index] = !updatedChecks[index];
    setCheckedItems(updatedChecks);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <View className="flex-1">
          <TaskList
            tasks={taskItems}
            onDelete={deleteTask}
            onUpdate={startEdit}
            checkedItems={checkedItems}
            onToggleCheck={toggleCheck}
          />
          <TaskInput text={task} onChange={setTask} onAdd={addTask} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
