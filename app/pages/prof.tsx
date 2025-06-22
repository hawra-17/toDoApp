// import React from "react";
// import { View, Text, TouchableOpacity, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Prof() {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("user_id");
//       router.replace("/(tabs)/profile"); // go back to tab screen
//     } catch (error) {
//       Alert.alert("Error", "Failed to log out.");
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 items-center justify-center bg-white">
//       <View className="items-center space-y-4">
//         <Text className="text-2xl font-bold">Welcome to your Profile!</Text>
//         <Text className="text-lg text-gray-600">You are logged in 🎉</Text>
//         <TouchableOpacity
//           onPress={handleLogout}
//           className="mt-6 bg-red-500 px-5 py-3 rounded-2xl"
//         >
//           <Text className="text-white font-semibold">Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

import React from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Prof() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
      router.replace("/(tabs)/profile");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 items-center justify-center px-6">
        {/* Profile Icon */}
        <View className="bg-white p-6 rounded-full shadow-lg mb-6">
          <Ionicons name="person-circle-outline" size={100} color="#4B5563" />
        </View>

        {/* Welcome Text */}
        <Text className="text-3xl font-extrabold text-gray-800 mb-2">
          Welcome Back!
        </Text>
        <Text className="text-lg text-gray-600 mb-6">
          You're successfully logged in 🎉
        </Text>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 px-8 py-3 rounded-xl shadow"
        >
          <Text className="text-white text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
