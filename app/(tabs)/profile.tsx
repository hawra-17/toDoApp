import { Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignCard from "@/component/signCard";
import Line from "@/component/DividerWithText";
import Rest from "@/component/restOfLogin";

export default function profile() {
  return (
    <SafeAreaView className="bg-gray-500/15 flex items-center mt-20 mx-5 rounded-3xl shadow-xl ">
      <Text className="font-bold text-xl">Sign in to your account</Text>
      <View>
        <SignCard />
      </View>
      <Line />
      <Rest />
    </SafeAreaView>
  );
}
