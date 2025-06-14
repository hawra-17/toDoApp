import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import Card from "./card";

interface TaskListProps {
  tasks: string[];
  onDelete: (index: number) => void;
  onUpdate: (index: number) => void;
  checkedItems: boolean[];
  onToggleCheck: (index: number) => void;
}

const TaskList = ({
  tasks,
  onDelete,
  onUpdate,
  checkedItems,
  onToggleCheck,
}: TaskListProps) => {
  return (
    <ScrollView className="flex-1">
      <View className="mt-6  ml-5 ">
        <Text className="text-3xl font-bold text-blue-500">Today's tasks</Text>
      </View>
      {tasks.map((task, index) => (
        <Card
          key={index}
          text={task}
          checked={checkedItems[index]}
          onToggleCheck={() => onToggleCheck(index)}
          onDelete={() => onDelete(index)}
          onUpdate={() => onUpdate(index)}
        />
      ))}
    </ScrollView>
  );
};

export default TaskList;
