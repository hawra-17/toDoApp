import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

interface JoinOrgModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onJoinSuccess: (orgData: any) => void;
}

interface OrgFetchResponse {
  exists: boolean;
  visibility?: "public" | "private";
  orgData?: {
    orgId: string;
    orgName: string;
    industry?: string;
    description?: string;
    type?: "business" | "personal";
  };
  passwordMatch?: boolean;
}


export default function JoinOrgModal({
  visible,
  setVisible,
  onJoinSuccess,
}: JoinOrgModalProps) {
  const [orgCode, setOrgCode] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [step, setStep] = useState<"search" | "password" | "joining" | "error">("search");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orgData, setOrgData] = useState<any>(null);

  const reset = () => {
    setOrgCode("");
    setOrgPassword("");
    setStep("search");
    setError("");
    setOrgData(null);
      setIsLoading(false);
  };

async function fetchOrgByCode(code: string): Promise<OrgFetchResponse> {
  try {
    const url = `${API_BASE}/organizations/code/${code.trim()}`;
    console.log("Calling:", url);

    const res = await fetch(url);
    if (!res.ok) {
      console.log("Fetch failed:", res.status);
      return { exists: false };
    }

    const data = await res.json();
    console.log("Fetched org:", data);

    return {
      exists: true,
      visibility: data.visibility,
      orgData: {
        orgId: data.orgId,
        orgName: data.orgName,
      },
    };
  } catch (err) {
    console.log("Error in fetchOrgByCode:", err);
    return { exists: false };
  }
}


const handleSearch = async () => {
  setError("");
  if (!orgCode.trim()) {
    setError("Please enter an organization code.");
    return;
  }

  setIsLoading(true);
  const lookup = await fetchOrgByCode(orgCode.trim());
  setIsLoading(false);

  if (!lookup.exists) {
    setError("No organization found with this code.");
    setStep("error");
    return;
  }

  if (lookup.visibility === "public") {
    setOrgData(lookup.orgData);
    setStep("joining");

    const userId = await AsyncStorage.getItem("user_id");

    const res = await fetch(`${API_BASE}/organizations/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        org_code: orgCode.trim(),
        org_password: "", // for public org
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message = data.error || "Failed to join";
      setError(message); // from backend
      setStep("error");

      return;
    }

    setTimeout(() => {
      onJoinSuccess({
        orgData: data,
        userRole: "member",
      });
      setVisible(false);
      reset();
    }, 1500);
  } else {
    setOrgData(lookup.orgData);
    setStep("password");
  }
};


const handleJoinPrivate = async () => {
  setError("");
  if (!orgPassword.trim()) {
    setError("Please enter the password.");
    return;
  }

  setIsLoading(true);
  const userId = await AsyncStorage.getItem("user_id");

  try {
    const res = await fetch(`${API_BASE}/organizations/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        org_code: orgCode.trim(),
        org_password: orgPassword.trim(),
      }),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
        const message = data.error || "Join failed";
        setError(message);  // from backend
      return;
    }

    setStep("joining");
    setTimeout(() => {
      onJoinSuccess({
        orgData: data,
        userRole: "member",
      });
      setVisible(false);
      reset();
    }, 1500);
  } catch (err) {
    console.error("Join error:", err);
    setError("Something went wrong");
    setIsLoading(false);
  }
};

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-black/40 px-4"
        >
          <View className="bg-white w-full rounded-2xl p-6" style={{ maxWidth: 350 }}>
            <Text className="text-xl mb-4 text-center text-[#213555]" style={{ fontFamily: "Poppins_700Bold" }}>
              Join Organization
            </Text>

            {step === "search" && (
              <>
                <TextInput
                  placeholder="Enter Organization Code"
                  value={orgCode}
                  onChangeText={setOrgCode}
                  className="border border-gray-300 rounded-full px-4 py-2 mb-3"
                  style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}
                  editable={!isLoading}
                />
                {error ? <Text className="text-red-500 text-sm mb-2 text-center"
                              style={{ fontFamily: "Poppins_400Regular" }}
                          >
                            {error}
                          </Text> 
                : null}
                <TouchableOpacity
                  onPress={handleSearch}
                  className="bg-[#213555] py-2 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center text-white" style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}>
                      Search
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={() => {
                    reset();
                    setVisible(false);
                  }}
                  className="mt-3 bg-gray-300 py-2 rounded-full"
                >
                  <Text className="text-center text-[#213555]" style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === "password" && (
              <>
                <Text className="mb-2 text-center text-[#213555]">Private Organization - Enter password</Text>
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  value={orgPassword}
                  onChangeText={setOrgPassword}
                  className="border border-gray-300 rounded-full px-4 py-2 mb-3"
                  style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}
                  editable={!isLoading}
                />
                {error ? <Text className="text-red-500 text-sm mb-2 text-center">{error}</Text> : null}
                <TouchableOpacity
                  onPress={handleJoinPrivate}
                  className="bg-[#213555] py-2 rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-center text-white" style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}>
                      Join
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={() => {
                    reset();
                    setVisible(false);
                  }}
                  className="mt-3 bg-gray-300 py-2 rounded-full"
                >
                  <Text className="text-center text-[#213555]" style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {step === "joining" && (
              <View className="items-center py-4">
                <Text className="text-center text-[#213555] mb-2" style={{ fontFamily: "Poppins_400Regular" }}>
                  Joining {orgData?.orgName}...
                </Text>
                <ActivityIndicator size="small" color="#213555" />
              </View>
            )}

            {step === "error" && (
              <>
                <Text className="text-center text-red-400 mb-4 text-sm"  style={{ fontFamily: "Poppins_400Regular"}}>{error}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setStep("search");
                    setError("");
                  }}
                  className="bg-gray-300 py-2 rounded-full"
                >
                  <Text className="text-center text-[#213555]" style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}>
                    Try Again
                  </Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  onPress={() => {
                    reset();
                    setVisible(false);
                  }}
                  className="mt-3 bg-gray-300 py-2 rounded-full"
                >
                  <Text className="text-center text-[#213555]" style={{ fontFamily: "Poppins_400Regular", fontSize: 13 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
