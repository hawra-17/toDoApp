import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";

export default function signUp() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const SignUp = () => {
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
      alert("Password not mach");
    } else router.push("./(tabs)");
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
        />
        <TextInput
          className="flex flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4  "
          placeholder="Password"
          placeholderTextColor="#fff"
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          className="flex flex-row items-center bg-gray-500/10 rounded-2xl px-5 py-3 w-72 justify-center space-x-3 mb-4  "
          placeholder="Confirm Password"
          placeholderTextColor="#fff"
          value={confirmPass}
          onChangeText={setConfirmPass}
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
