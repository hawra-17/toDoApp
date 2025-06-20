import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Switch,
  Modal,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const tabs = ["Tasks", "Members", "Settings"];

export default function OrganizationScreen() {
  const [activeTab, setActiveTab] = useState("Tasks");
  const navigation = useNavigation();

  const params = useLocalSearchParams();
  const orgDataRaw = params.orgData as string | undefined;
  const userRole = (params.userRole as "admin" | "member") || "member";

  let orgData;
  try {
    orgData = orgDataRaw ? JSON.parse(orgDataRaw) : null;
  } catch (e) {
    console.error("Invalid orgData JSON:", e);
    orgData = null;
  }

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  const [industryModalVisible, setIndustryModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    orgName: orgData?.orgName || "",
    orgCode: orgData?.orgCode || "",
    body: orgData?.body || "",
    visibility: orgData?.visibility || "public",
    isBusiness: orgData?.isBusiness || false,
    businessDetails: {
      businessName: orgData?.businessName || "",
      websiteURL: orgData?.websiteURL || "",
      industry: orgData?.industry || "Tech",
      contactEmail: orgData?.contactEmail || "",
      logoUrl: orgData?.logoUrl || "",
    },
  });

  if (!fontsLoaded) return <AppLoading />;

  if (!orgData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text style={{ fontFamily: "Poppins_400Regular" }} className="text-gray-500">
          No organization data provided.
        </Text>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    if (activeTab === "Tasks") {
      return (
        <Text className="text-center text-gray-600" style={{ fontFamily: "Poppins_400Regular" }}>
          Task list will be here.
        </Text>
      );
    }
    if (activeTab === "Members") {
      return (
        <Text className="text-center text-gray-600" style={{ fontFamily: "Poppins_400Regular" }}>
          Members list will show here.
        </Text>
      );
    }

    if (activeTab === "Settings" && userRole === "admin") {
      return (
        <View className="space-y-4">

          {/* Org Name */}
          <Text style={{ fontFamily: "Poppins_500Medium" }}>Organization Name</Text>
          <TextInput
            className="border border-gray-300 rounded-full px-4 py-2"
            style={{ fontFamily: "Poppins_400Regular" }}
            value={formData.orgName}
            onChangeText={(text) => setFormData({ ...formData, orgName: text })}
          />

          <Text style={{ fontFamily: "Poppins_500Medium" }}>Organization Code</Text>
          <TextInput
            className="border border-gray-300 rounded-full px-4 py-2"
            style={{ fontFamily: "Poppins_400Regular" }}
            value={formData.orgCode}
            onChangeText={(text) => setFormData({ ...formData, orgCode: text })}
          />

          <Text style={{ fontFamily: "Poppins_500Medium" }}>Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-2xl px-4 py-2"
            style={{ fontFamily: "Poppins_400Regular", textAlignVertical: "top" }}
            value={formData.body}
            onChangeText={(text) => setFormData({ ...formData, body: text })}
          />

          {/* Visibility */}
          <View className="flex-row justify-between items-center">
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Private Organization</Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#F96E2A" }}
              thumbColor={formData.visibility === "private" ? "#fff" : "#fff" }
              value={formData.visibility === "private"}
              onValueChange={(val) =>
                setFormData({ ...formData, visibility: val ? "private" : "public" })
              }
            />
          </View>

          {/* Business Toggle */}
          <View className="flex-row justify-between items-center">
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Is this a Business?</Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#F96E2A" }}
              thumbColor={formData.isBusiness ? "#fff" : "#fff" }
              value={formData.isBusiness}
              onValueChange={(val) =>
                setFormData({ ...formData, isBusiness: val })
              }
            />
          </View>

          {/* Business Details */}
          {formData.isBusiness && (
            <>
              <Text style={{ fontFamily: "Poppins_500Medium" }}>Business Name</Text>
              <TextInput
                className="border border-gray-300 rounded-full px-4 py-2"
                value={formData.businessDetails.businessName}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessDetails: { ...prev.businessDetails, businessName: text },
                  }))
                }
              />

              <Text style={{ fontFamily: "Poppins_500Medium" }}>Website URL</Text>
              <TextInput
                className="border border-gray-300 rounded-full px-4 py-2"
                value={formData.businessDetails.websiteURL}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessDetails: { ...prev.businessDetails, websiteURL: text },
                  }))
                }
              />

              <Text style={{ fontFamily: "Poppins_500Medium" }}>Contact Email</Text>
              <TextInput
                className="border border-gray-300 rounded-full px-4 py-2"
                value={formData.businessDetails.contactEmail}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessDetails: { ...prev.businessDetails, contactEmail: text },
                  }))
                }
              />

              {/* Industry Picker */}
              <Text style={{ fontFamily: "Poppins_500Medium" }}>Industry</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-full px-4 py-2"
                onPress={() => setIndustryModalVisible(true)}
              >
                <Text style={{ fontFamily: "Poppins_400Regular" }}>
                  {formData.businessDetails.industry || "Select Industry"}
                </Text>
              </TouchableOpacity>

              <Modal visible={industryModalVisible} transparent animationType="fade">
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center" }}
                  onPress={() => setIndustryModalVisible(false)}
                  activeOpacity={1}
                >
                  <View className="bg-white mx-8 rounded-lg p-4">
                    {[
                      "Tech",
                      "Retail",
                      "Health",
                      "Finance",
                      "Education",
                      "Other",
                    ].map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          setFormData((prev) => ({
                            ...prev,
                            businessDetails: { ...prev.businessDetails, industry: option },
                          }));
                          setIndustryModalVisible(false);
                        }}
                        className="py-2"
                      >
                        <Text style={{ fontFamily: "Poppins_400Regular" }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          )}

          {/* Save Button */}
          <TouchableOpacity
            onPress={() => console.log("Save settings", formData)}
            className="mt-4 bg-[#213555] rounded-full p-3"
          >
            <Text className="text-white text-center" style={{ fontFamily: "Poppins_700Bold" }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="px-4 py-3">
          <Text style={{ color: "#213555", fontFamily: "Poppins_500Medium" }}>← Back</Text>
        </TouchableOpacity>

        {/* Org Info Header */}
        <View className="bg-[#213555] py-6 px-4 rounded-b-3xl items-center">
          {orgData.logoUrl ? (
            <Image source={{ uri: orgData.logoUrl }} style={{ width: 60, height: 60, borderRadius: 30 }} />
          ) : (
            <View className="bg-white rounded-full w-12 h-12 justify-center items-center">
              <Text className="text-[#213555] text-xl" style={{ fontFamily: "Poppins_700Bold" }}>
                {orgData.orgName?.[0] || "O"}
              </Text>
            </View>
          )}

          <Text className="text-white text-2xl mt-2" style={{ fontFamily: "Poppins_700Bold" }}>
            {orgData.orgName}
          </Text>
          {orgData.description && (
            <Text className="text-white text-sm mt-1" style={{ fontFamily: "Poppins_400Regular" }}>
              {orgData.description}
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View className="flex-row justify-around mt-4 border-b border-gray-200 pb-2">
          {tabs.map((tab) => {
            if (tab === "Settings" && userRole !== "admin") return null;

            return (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  className={`${
                    activeTab === tab ? "text-[#213555]" : "text-gray-500"
                  }`}
                  style={{
                    fontFamily: activeTab === tab ? "Poppins_700Bold" : "Poppins_500Medium",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        <View className="px-4 pt-4 pb-10">{renderTabContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
