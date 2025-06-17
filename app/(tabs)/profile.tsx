import { Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignCard from "@/component/signCard";
import Line from "@/component/DividerWithText";
import Rest from "@/component/restOfLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const checkLogin = async () => {
        const userId = await AsyncStorage.getItem("user_id");
        setIsLoggedIn(!!userId);
      };

      checkLogin();
    }, [])
  );

  // Redirect to really profile page if user log in
  useEffect(() => {
    if (isLoggedIn === true) {
      router.replace("/pages/prof");
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) return null;

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
