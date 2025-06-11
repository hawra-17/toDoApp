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

  const addTask = () => {
    if (!task.trim()) return;
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask("");
  };

  const deleteTask = (index: number) => {
    const copy = [...taskItems];
    copy.splice(index, 1);
    setTaskItems(copy);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <View className="flex-1">
          <TaskList tasks={taskItems} onDelete={deleteTask} />
          <TaskInput text={task} onChange={setTask} onAdd={addTask} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
