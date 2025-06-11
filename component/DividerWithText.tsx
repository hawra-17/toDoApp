import { View, Text } from "react-native";
import React from "react";

export default function DividerWithText() {
  return (
    <View className="flex-row items-center my-4 px-6">
      <View className="flex-1 h-px bg-gray-500 opacity-50" />
      <Text className="text-black text-sm px-3">Or continue with</Text>
      <View className="flex-1 h-px bg-gray-500 opacity-50" />
    </View>
  );
}
