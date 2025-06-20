import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export default function signUp() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const SignUp = async () => {
    if (name.length === 0) {
      alert("Please enter your name ");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (email.length === 0) {
      alert("please enter your email address");
      return;
    }

    if (password.length < 8) {
      alert("password must be at least 8 characters");
      return;
    }

    if (!(password === confirmPass)) {
      alert("Password not match");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/signup`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        Alert.alert("Signup failed", result?.error || "Something went wrong");
        return;
      }

      alert("Signup successful!");
      router.push("./(tabs)");
    } catch (error) {
      Alert.alert("Error", "Signup failed due to network or server error.");
    }
  };

  return (
    <View>
      <View className="items-center mt-6 space-y-4">
        <TextInput
          className="flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4 "
          placeholder="Enter Your name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4 "
          placeholder="Email Address"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="flex flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4  "
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className="flex flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4  "
          placeholder="Confirm Password"
          placeholderTextColor="#fff"
          value={confirmPass}
          onChangeText={setConfirmPass}
          secureTextEntry
        />
        <TouchableOpacity
          className="flex flex-row mt-7 rounded-2xl bg-white px-5 py-3 w-72 items-center justify-center"
          onPress={SignUp}
        >
          <Text>Sign UP</Text>
        </TouchableOpacity>
        <View className="flex flex-row gap-x-2 mt-5 justify-center items-center">
          <Text> have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Text className="underline">Sign in </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
