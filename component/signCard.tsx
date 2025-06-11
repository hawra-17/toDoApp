import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import GoogleLogo from "../assets/GoogleLogo.png";
import AppleLogo from "../assets/AppleLogo.png";
import Line from "../component/DividerWithText";

export default function SignCard() {
  return (
    <View className="items-center mt-6 space-y-4">
      <TouchableOpacity className="flex-row items-center bg-gray-500/35 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4">
        <Image source={GoogleLogo} className="w-7 h-7 mr-3 " />
        <Text className="text-white gap-x-2">Sign In With Google</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-gray-500/35 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4">
        <Image source={AppleLogo} className="w-6 h-6 mr-3" />
        <Text className="text-white">Sign In With Apple</Text>
      </TouchableOpacity>
    </View>
  );
}
