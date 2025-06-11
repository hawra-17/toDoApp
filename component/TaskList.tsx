import React from "react";
import { ScrollView, View, Text } from "react-native";
import Card from "./card";

interface TaskListProps {
  tasks: string[];
  onDelete: (index: number) => void;
}

const TaskList = ({ tasks, onDelete }: TaskListProps) => {
  return (
    <ScrollView className="flex-1">
      <View className="mt-5 ml-5">
        <Text className="text-3xl text-blue-500">Today's tasks</Text>
      </View>
      {tasks.map((task, index) => (
        <Card key={index} text={task} onDelete={() => onDelete(index)} />
      ))}
    </ScrollView>
  );
};

export default TaskList;
