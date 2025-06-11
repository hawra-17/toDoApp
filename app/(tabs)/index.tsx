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

  const addTask = () => {
    if (!task.trim()) return;
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setCheckedItems([...checkedItems, false]);
    setTask("");
  };

  const deleteTask = (index: number) => {
    const copyTask = [...taskItems];
    const copyCheckedItems = [...checkedItems];
    copyTask.splice(index, 1);
    copyCheckedItems.splice(index, 1);
    setTaskItems(copyTask);
    setCheckedItems(copyCheckedItems);
  };

  const update = (index: number, text: string) => {
    const copyTask = [...taskItems];
    copyTask[index] = text;
    setTaskItems(copyTask);
  };
  const startEdit = (index: number) => {
    setTask(taskItems[index]); // Send the selected task text into the input
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
            onUpdate={update}
            checkedItems={checkedItems}
            onToggleCheck={toggleCheck}
          />
          <TaskInput text={task} onChange={setTask} onAdd={addTask} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
