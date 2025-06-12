import { Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignCard from "@/component/signCard";
import Line from "@/component/DividerWithText";
import Rest from "@/component/restOfLogin";

export default function profile() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="bg-gray-500/15 w-11/12 max-w-md rounded-3xl shadow-xl p-6 items-center space-y-4">
        <Text className="font-bold text-xl">Sign in to your account</Text>
        <SignCard />
        <Line />
        <Rest />
      </View>
    </SafeAreaView>
  );
}
