import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TaskInputProps {
  text: string;
  onChange: (text: string) => void;
  onAdd: () => void;
}

const TaskInput = ({ text, onChange, onAdd }: TaskInputProps) => {
  return (
    <View className="flex-row items-center justify-around px-4 py-3 border-t border-gray-200">
      <TextInput
        className="border-2 rounded-3xl px-5 py-3 flex-1 mr-3"
        placeholder="Enter the text"
        value={text}
        onChangeText={onChange}
      />
      <TouchableOpacity onPress={onAdd}>
        <Ionicons name="add-circle" size={40} />
      </TouchableOpacity>
    </View>
  );
};

export default TaskInput;
