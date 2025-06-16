import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Prof() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
      router.replace("/(tabs)/profile"); // go back to login after logout
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="items-center space-y-4">
        <Text className="text-2xl font-bold">Welcome to your Profile!</Text>

        {/* Add your profile content here */}
        <Text className="text-lg text-gray-600">You are logged in 🎉</Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 bg-red-500 px-5 py-3 rounded-2xl"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
