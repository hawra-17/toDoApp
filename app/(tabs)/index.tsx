import {
  Text,
  TextInput,
  View,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Card from "../../component/card";
import { Ionicons } from "@expo/vector-icons";

export default function index() {
  const [task, setTask] = useState<string>("");
  const [taskItems, setTaskItems] = useState<string[]>([]);

  const addTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80} // adjust if needed
      >
        <View className="flex-1">
          <ScrollView className="flex-1">
            <View className="mt-5 ml-5">
              <Text className="text-3xl text-blue-500">Today's tasks</Text>
            </View>
            {taskItems.map((item, index) => {
              return <Card key={index} text={item} />;
            })}
          </ScrollView>

          {/* Input at the bottom */}
          <View className="flex-row items-center justify-around px-4 py-3 border-t border-gray-200">
            <TextInput
              className="border-2 rounded-3xl px-5 py-3 flex-1 mr-3"
              placeholder="Enter the text"
              value={task}
              onChangeText={(text) => setTask(text)}
            />
            <TouchableOpacity onPress={() => addTask()}>
              <Ionicons name="add-circle" size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
