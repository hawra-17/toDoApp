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
  businessName: string;
  setBusinessName: (text: string) => void;
  websiteURL: string;
  setWebsiteURL: (text: string) => void;
  industry: "Tech" | "Retail" | "Health" | "Finance" | "Education" | "Other";
  setIndustry: (industry: "Tech" | "Retail" | "Health" | "Finance" | "Education" | "Other") => void;
  contactEmail: string;
  setContactEmail: (text: string) => void;
  logoUrl: string;
  setLogoUrl: (text: string) => void;
  pickImage: () => Promise<void>;
  errors: {
    orgName: boolean;
    orgCode: boolean;
    businessName: boolean;
  };
  onSubmit: () => void;
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
  businessName,
  setBusinessName,
  websiteURL,
  setWebsiteURL,
  industry,
  setIndustry,
  contactEmail,
  setContactEmail,
  logoUrl,
  setLogoUrl,
  pickImage,
  errors,
  onSubmit,
}: CreateOrgModalProps)
 {

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
    setBusinessName("");
    setWebsiteURL("");
    setIndustry("Tech");
    setContactEmail("");
    setLogoUrl("");
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

            {/* Org Name */}
            <TextInput
              placeholder="Org Name"
              value={orgName}
              onChangeText={setOrgName}
              className={`border rounded-full px-4 py-2 mb-2 ${
                errors.orgName ? "border-red-500" : "border-gray-300"
              }`}
              style={{ fontFamily: "Poppins_400Regular", 
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
                className={`flex-1 border rounded-full px-4 py-2 ${
                  errors.orgCode ? "border-red-500" : "border-gray-300"
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
                className="border border-gray-300 rounded-full px-4 py-2 mb-2"
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
                  className={`flex-1 py-2 rounded-full ${
                    visibility === option ? "bg-[#F96E2A]" : "bg-gray-300"
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

            {/* Business Info */}
            
            {/* Toggle */}
            {isBusiness && (
              <>
                <TextInput
                  placeholder="Business Name"
                  value={businessName}
                  onChangeText={setBusinessName}
                  className={`border rounded-full px-4 py-2 mb-2 ${
                    errors.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 13,
                }}
                />

              {/* Website URL */}
                <TextInput
                  placeholder="Website URL"
                  value={websiteURL}
                  onChangeText={setWebsiteURL}
                  placeholderTextColor="#999"
                  className={"border border-gray-300 rounded-full px-4 py-2 mb-2 w-full"}
                  style={{ fontFamily: "Poppins_400Regular", 
                           fontSize: 13,
                   }}
                />

              {/* setIndustry */}
                <Text className="text-gray-700 mb-1 mt-2"                           
                      style={{ fontFamily: "Poppins_400Regular", 
                          fontSize: 13,
                        }}>Select Industry:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                  {["Tech", "Retail", "Health", "Finance", "Education", "Other"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() =>
                        setIndustry(
                          item as
                            | "Tech"
                            | "Retail"
                            | "Health"
                            | "Finance"
                            | "Education"
                            | "Other"
                        )
                      }
                      className={`px-4 py-1 rounded-full mr-2 ${
                        industry === item ? "bg-[#F96E2A]" : "bg-gray-300"
                      }`}
                    >
                      <Text className="text-white"
                          style={{ fontFamily: "Poppins_400Regular", 
                          fontSize: 13,
                        }}
                        >{item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Email */}
                <TextInput
                  placeholder="Contact Email"
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  className="border border-gray-300 rounded-full px-4 py-2 mb-2
                  "
                  style={{ fontFamily: "Poppins_400Regular", 
                          fontSize: 13,
                        }}                  
                />

                {/* LOGO */}
                {logoUrl ? (
                  <View style={{ alignSelf: "center", marginBottom: 10, position: "relative" }}>
                    <TouchableOpacity onPress={pickImage}>
                      <Image
                        source={{ uri: logoUrl }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                        }}
                      />
                    </TouchableOpacity>

                    {/* Delete logo */}
                    <TouchableOpacity
                      onPress={() => setLogoUrl("")} // clear the logoUrl state
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 12,
                        padding: 4,
                        zIndex: 1,
                      }}
                    >
                      <Feather name="x" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={pickImage} className="mb-3">
                    <View className="bg-gray-100 p-3 rounded-full border border-gray-300 items-center">
                      <Text
                        className="text-gray-600"
                        style={{
                          fontFamily: "Poppins_400Regular",
                          fontSize: 13,
                        }}
                      >
                        Choose Logo Image
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

              </>
            )}

            {/* Buttons */}
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setVisible(false);
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
