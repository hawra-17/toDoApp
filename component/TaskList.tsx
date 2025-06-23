import React from "react";
import {
  ScrollView, View, Text, Platform, StatusBar,
  SafeAreaView,
} from "react-native";
import Card from "./card";

interface Task {
  id: number;
  title: string;
  checked: boolean;
  assigneeName?: string | null; // only used by org tasks
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onUpdate: (task: Task) => void;
  onToggleCheck: (id: number) => void;
  type?: "personal" | "organization"; // to distinguish between usage
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onUpdate,
  onToggleCheck,
  type = "personal", // Default to personal
}) => {
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>
        {type === "personal" && (
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl text-[#213555]" style={{ fontFamily: "Poppins_700Bold" }}>
              Today's tasks
            </Text>
          </View>
        )}
        <View className="space-y-4">
          {tasks.map((task) => (
            <View key={`${task.id}-${task.title}`} className="mb-4">

              <Card
                text={task.title}
                checked={task.checked}
                onToggleCheck={() => onToggleCheck(task.id)}
                onDelete={() => onDelete(task.id)}
                onUpdate={() => onUpdate(task)}
              />
              {type === "organization" && task.assigneeName && (
                <Text className="text-xs text-gray-500 mt-1 ml-10"
                  style={{
                    fontFamily: "Poppins_500Medium",
                  }}>
                  {task.assigneeName}
                </Text>
              )}
            </View>
          ))}

        </View>

      </ScrollView>
    </SafeAreaView>

  );
};

export default TaskList;
