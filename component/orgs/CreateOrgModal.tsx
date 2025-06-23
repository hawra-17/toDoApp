import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView, Platform
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Feather } from '@expo/vector-icons';

function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface CreateOrgModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  orgName: string;
  setOrgName: (text: string) => void;
  orgCode: string;
  setOrgCode: (text: string) => void;
  orgPassword: string;
  setOrgPassword: (text: string) => void;
  orgBody: string;
  setOrgBody: (text: string) => void;
  visibility: "public" | "private";
  setVisibility: (visibility: "public" | "private") => void;
  isBusiness: boolean;
  setIsBusiness: (val: boolean) => void;
  errors: {
    orgName: boolean;
    orgCode: boolean;
    orgPassword: boolean;
  };
  onSubmit: () => void;
  orgExistsError: boolean;
  setOrgExistsError: (val: boolean) => void;
}

export default function CreateOrgModal({
  visible,
  setVisible,
  orgName,
  setOrgName,
  orgCode,
  setOrgCode,
  orgPassword,
  setOrgPassword,
  orgBody,
  setOrgBody,
  visibility,
  setVisibility,
  isBusiness,
  setIsBusiness,
  errors,
  onSubmit,
  orgExistsError,
  setOrgExistsError,
}: CreateOrgModalProps) {

  const [isGenerating, setIsGenerating] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  if (!fontsLoaded) return <AppLoading />;

  const resetForm = () => {
    setOrgName("");
    setOrgCode("");
    setOrgPassword("");
    setOrgBody("");

    setVisibility("public");
    setIsBusiness(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-black/40 px-4"
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View
            className="bg-white w-full rounded-2xl"
            style={{
              maxWidth: 350,
              maxHeight: '90%',
            }}
          >
            <ScrollView
              contentContainerStyle={{ padding: 24 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-xl mb-4 text-center text-[#213555]"
                style={{ fontFamily: "Poppins_700Bold" }}>
                Create Organization
              </Text>

              {/* Org name */}
              <TextInput
                placeholder="Org Name"
                value={orgName}
                onChangeText={setOrgName}
                className={`border rounded-full px-4 py-2 mb-2 ${errors.orgName ? "border-red-500" : "border-gray-300"
                  }`}
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                }}
              />

              {/* Code + generate */}
              <View className="flex-row items-center gap-2 mb-2">
                {/* code Input */}
                <TextInput
                  placeholder="Org Code (used to join)"
                  value={orgCode}
                  onChangeText={(text) => {
                    const filtered = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();
                    setOrgCode(filtered);
                  }}
                  className={`flex-1 border rounded-full px-4 py-2 ${errors.orgCode ? "border-red-500" : "border-gray-300"
                    }`}
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 13,
                  }}
                />

                {/* refresh Icon Button */}
                <TouchableOpacity
                  onPress={async () => {
                    setIsGenerating(true);
                    await new Promise((res) => setTimeout(res, 500));
                    const code = generateRandomCode();
                    setOrgCode(code);
                    setIsGenerating(false);
                  }}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: "#F96E2A",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 38,
                    width: 38,
                    borderRadius: 22,
                    opacity: isGenerating ? 0.9 : 1,
                  }}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Feather name="refresh-ccw" size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>




              {/* Password */}
              {visibility === "private" && (
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  value={orgPassword}
                  onChangeText={setOrgPassword}
                  className={`border rounded-full px-4 py-2 mb-2 ${errors.orgPassword ? "border-red-500" : "border-gray-300"
                    }`}
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 13,
                  }}
                />
              )}


              {/* Description */}
              <TextInput
                placeholder="Description"
                value={orgBody}
                onChangeText={setOrgBody}
                multiline
                className="border border-gray-300 rounded-2xl px-4 py-2 mb-2"
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                }}
              />

              {/* Visibility */}
              <View className="flex-row mb-2" style={{ gap: 8 }}>
                {["public", "private"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setVisibility(option as "public" | "private")}
                    className={`flex-1 py-2 rounded-full ${visibility === option ? "bg-[#F96E2A]" : "bg-gray-300"
                      }`}
                  >
                    <Text className="text-center text-white capitalize"
                      style={{
                        fontFamily: "Poppins_400Regular",
                        fontSize: 13,
                      }}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Business Switch */}
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-700"
                  style={{
                    fontFamily: "Poppins_400Regular",
                    fontSize: 13,
                  }}>Is this a business?
                </Text>
                <Switch
                  value={isBusiness}
                  onValueChange={setIsBusiness}
                  trackColor={{ false: "#ccc", true: "#F96E2A" }}
                  thumbColor={isBusiness ? "#fff" : "#fff"}
                />
              </View>

              {orgExistsError && (
                <Text className="text-red-500 text-xs ml-2 -mt-1 mb-2 text-center"
                  style={{ fontFamily: "Poppins_400Regular" }}>
                  Organization code already exists.
                </Text>
              )}
              {/* Buttons */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={() => {
                    resetForm();
                    setVisible(false);
                    setOrgExistsError(false);  // reset error
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded-full mr-2"
                >
                  <Text className="text-center text-white font-semibold"
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 13,
                    }}
                  >Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onSubmit}
                  className="flex-1 bg-[#213555] py-2 rounded-full ml-2"
                >
                  <Text className="text-center text-white font-semibold"
                    style={{
                      fontFamily: "Poppins_400Regular",
                      fontSize: 13,
                    }}
                  >Create</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
