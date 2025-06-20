import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import TaskList from "../../component/TaskList";
import TaskInput from "../../component/TaskInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // ✅ Import navigation

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

interface Task {
  id: number;
  title: string;
  checked: boolean;
}

export default function Index() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const navigation = useNavigation();

  const fetchTasks = async () => {
    const uid = await AsyncStorage.getItem("user_id");
    if (!uid) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    // to fetch the task
    setLoggedIn(true);
    setUserId(uid);

    try {
      const res = await fetch(`${API_BASE}/tasks/${uid}`);
      const data = await res.json();

      setTasks(
        data.map((t: any) => ({
          id: t.task_id,
          title: t.task_title,
          checked: t.taskStatus === "done",
        }))
      );
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const unsubscribe = navigation.addListener("focus", fetchTasks);
    return unsubscribe;
  }, [navigation]);

  const addOrUpdateTask = async () => {
    if (!task.trim() || !userId) return;

    try {
      if (editTask) {
        const res = await fetch(`${API_BASE}/update-task/${editTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: task }),
        });

        if (!res.ok) throw new Error("Failed to update task");

        setTasks((prev) =>
          prev.map((t) => (t.id === editTask.id ? { ...t, title: task } : t))
        );
        setEditTask(null);
      } else {
        const res = await fetch(`${API_BASE}/add-task`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task,
            description: "",
            creator_id: parseInt(userId),
          }),
        });

        const data = await res.json();

        setTasks([
          ...tasks,
          {
            id: data.task_id,
            title: task,
            checked: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Task submission error:", error);
    }

    setTask("");
    Keyboard.dismiss();
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/delete-task/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const startEdit = (task: Task) => {
    setTask(task.title);
    setEditTask(task);
  };

  const toggleCheck = async (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  if (loading) return null;

  if (!loggedIn) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-gray-600">
          Please log in to view your tasks.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <View className="flex-1">
          <TaskList
            tasks={tasks}
            onDelete={deleteTask}
            onUpdate={startEdit}
            onToggleCheck={toggleCheck}
          />
          <TaskInput text={task} onChange={setTask} onAdd={addOrUpdateTask} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
