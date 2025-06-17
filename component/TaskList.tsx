import React from "react";
import { ScrollView, View, Text } from "react-native";
import Card from "./card";

interface Task {
  id: number;
  title: string;
  checked: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onUpdate: (task: Task) => void;
  onToggleCheck: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onUpdate,
  onToggleCheck,
}) => {
  return (
    <ScrollView className="flex-1 px-4">
      <View className="mt-6">
        <Text className="text-3xl font-bold text-blue-500 mb-4">
          Today's tasks
        </Text>
      </View>

      <View className="space-y-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            text={task.title}
            checked={task.checked}
            onToggleCheck={() => onToggleCheck(task.id)}
            onDelete={() => onDelete(task.id)}
            onUpdate={() => onUpdate(task)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default TaskList;
