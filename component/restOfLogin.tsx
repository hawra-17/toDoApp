import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";

export default function restOfLogin() {
  return (
    <View className="items-center mt-6 space-y-4">
      <TextInput
        className="flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4 "
        placeholder="Email Adress"
        placeholderTextColor="#fff"
      />
      <TextInput
        className="flex flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4  "
        placeholder="Password"
        placeholderTextColor="#fff"
      />

      <View className="flex flex-row flex-end justify-end ml-36 mt-1">
        <TouchableOpacity>
          <Text className="text-sm"> Forgot Password ? </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="flex flex-row mt-7 rounded-2xl bg-white px-5 py-3 w-72 items-center justify-center">
        <Text>Continue</Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-x-2 mt-5 justify-center items-center">
        <Text>Don't have an account?</Text>
        <TouchableOpacity>
          <Text className="underline">Sign up </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
