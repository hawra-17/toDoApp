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

interface JoinOrgModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onJoinSuccess: (orgData: any) => void;
}

interface OrgFetchResponse {
  exists: boolean;
  visibility?: "public" | "private";
  orgData?: {
    orgName: string;
  };
  passwordMatch?: boolean; // used only for private orgs
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

  // Simulated fetch  - WILL BE REPLACED
async function fetchOrgByCode(code: string): Promise<OrgFetchResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code === "123") {
        resolve({
          exists: true,
          visibility: "public",
          orgData: { orgName: "Test Org" },
        });
      } else if (code === "456") {
        resolve({
          exists: true,
          visibility: "private",
          orgData: { orgName: "Private Org" },
          passwordMatch: false,
        });
      } else {
        resolve({ exists: false });
      }
    }, 500); // simulate delay
  });
}

  const handleSearch = async () => {
    setError("");
    if (!orgCode.trim()) {
      setError("Please enter an organization code.");
      return;
    }
    setIsLoading(true);
    const res = await fetchOrgByCode(orgCode.trim());
    setIsLoading(false);

    if (!res.exists) {
      setError("No organization found with this code.");
      setStep("error");
      return;
    }

    if (res.visibility === "public") {
      setOrgData(res.orgData);
      setStep("joining");
      setTimeout(() => {
      onJoinSuccess({
        orgData: res.orgData,
        userRole: "member", //get this from the backend later
      });
         setVisible(false);
        reset();
      }, 1500);
    } else {
      setOrgData(res.orgData);
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
    // Simulate password check
    const res = await fetchOrgByCode(orgCode.trim());
    setIsLoading(false);

    // For demo, password is "password123"
    if (orgPassword === "password123") {
      setStep("joining");
      setTimeout(() => {
        onJoinSuccess(res.orgData);
        setVisible(false);
        reset();
      }, 1500);
    } else {
      setError("Incorrect password.");
      setStep("password");
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
                                 >{error}
                          </Text> : null}
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
                <Text className="mb-2 text-center text-[#213555]">Private Organization - enter password</Text>
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
                <Text className="text-center text-red-500 mb-4">{error}</Text>
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
