import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import SignUp from "@/component/signUp";

export default function index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="bg-gray-500/15 w-11/12 max-w-md rounded-3xl shadow-xl p-6 items-center space-y-4">
        <Text className="font-bold text-xl">Sign Up</Text>
        <SignUp />
      </View>
    </SafeAreaView>
  );
}
