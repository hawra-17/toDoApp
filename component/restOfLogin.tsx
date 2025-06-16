import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function restOfLogin() {
  const [Email, SetEmail] = useState<string>("");
  const [Password, SetPassword] = useState<string>("");
  const router = useRouter();

  const Login = async () => {
    if (!Email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (Email.length === 0) {
      alert("Please enter your email address");
      return;
    }

    if (Password.length === 0 || Password.length < 8) {
      alert("Please enter a valid password (at least 8 characters)");
      return;
    }

    try {
      const res = await fetch(
        "https://df07-82-167-194-251.ngrok-free.app/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: Email, password: Password }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        Alert.alert("Login Failed", error.error || "Unknown error");
        return;
      }

      const user = await res.json();
      await AsyncStorage.setItem("user_id", user.user_id.toString());
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Something went wrong during login");
    }
  };

  return (
    <View className="items-center mt-6 space-y-4">
      <TextInput
        className="flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4"
        placeholder="Email Address"
        placeholderTextColor="#fff"
        value={Email}
        onChangeText={SetEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="flex flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4"
        placeholder="Password"
        placeholderTextColor="#fff"
        value={Password}
        onChangeText={SetPassword}
        secureTextEntry
      />

      <View className="flex flex-row flex-end justify-end ml-36 mt-1">
        <TouchableOpacity>
          <Text className="text-sm"> Forgot Password ? </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="flex flex-row mt-7 rounded-2xl bg-white px-5 py-3 w-72 items-center justify-center"
        onPress={Login}
      >
        <Text>Sign in</Text>
      </TouchableOpacity>

      <View className="flex flex-row gap-x-2 mt-5 justify-center items-center">
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/pages")}>
          <Text className="underline">Sign up </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
