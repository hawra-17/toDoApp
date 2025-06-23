// My organizations Page
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Platform } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Feather } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import CreateOrgModal from "../../component/orgs/CreateOrgModal";
import JoinOrgModal from "../../component/orgs/joinOrgModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Org = {
  orgId: string;
  orgName: string;
  role: "admin" | "member";
  type: "business" | "personal";
  description?: string;
};

export default function myOrgs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "business" | "personal">("all");
  const navigation = useNavigation();
  const [org, setOrg] = useState<Org[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [orgBody, setOrgBody] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isBusiness, setIsBusiness] = useState(false);
  const [orgExistsError, setOrgExistsError] = useState(false);

  const [errors, setErrors] = useState({
    orgName: false,
    orgCode: false,
    orgPassword: false,
  });

  const fetchOrgs = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;

      const res = await fetch(`${API_BASE}/users/${userId}/organizations`);
      const data = await res.json();
      setOrg(data);
    } catch (err) {
      console.error("Failed to load user orgs", err);
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchOrgs(); // Load orgs 
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  const filteredOrgs = org.filter((org) => {
    const matchesSearch = org.orgName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || org.type === filterType;
    return matchesSearch && matchesType;
  });

  const router = useRouter();

  function handleJoinSuccess({
    orgData,
    userRole,
  }: {
    orgData: Org;
    userRole: "admin" | "member";
  }) {
    console.log("Joined org successfully:", orgData);

    fetchOrgs(); // Refresh joined orgs list
    router.push({
      pathname: "/pages/organization/insideOrg",
      params: {
        orgData: JSON.stringify(orgData),
        userRole,
      },
    });
  }

  const onCreateOrg = async () => {
    const newErrors = {
      orgName: !orgName.trim(),
      orgCode: !orgCode.trim(),
      orgPassword: visibility === "private" && !orgPassword.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    const creator_id = await AsyncStorage.getItem("user_id");

    try {
      const res = await fetch(`${API_BASE}/organizations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_name: orgName,
          org_code: orgCode,
          org_password: orgPassword || "",
          body: orgBody,
          visibility,
          is_business: isBusiness,
          creator_id: parseInt(creator_id!),
        }),
      });

      if (res.status === 409) {
        setOrgExistsError(true); // Show "org already exists"
        return;
      }
      setOrgExistsError(false);

      if (!res.ok) throw new Error("Failed to create organization.");


      const data = await res.json();

      console.log("Org created:", data);

      await fetchOrgs(); // Refresh orgs list

      // Clear and close modal
      setShowCreateModal(false);
      setOrgName("");
      setOrgCode("");
      setOrgPassword("");
      setOrgBody("");
      //setLogoUrl("");
      setIsBusiness(false);
    } catch (err) {
      console.error("Org creation failed:", err);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, }}
    >
      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>

        {/* Title + create and join */}
        <View className="flex-row justify-between items-center mb-3">

          <Text
            className="text-2xl text-[#213555]"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            My Organizations
          </Text>

          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-full border ml-12"
            style={{
              borderColor: "#213555",
              borderWidth: 1,
            }}
          >
            <Text
              className="text-[#213555]"
              style={{
                fontFamily: "Poppins",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Create
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-[#213555] rounded-full border"
            style={{
              borderColor: "#213555",
              borderWidth: 1,
            }}
          >
            <Text
              className="text-white"
              style={{
                fontFamily: "Poppins",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Join
            </Text>
          </TouchableOpacity>

          <JoinOrgModal
            visible={showJoinModal}
            setVisible={setShowJoinModal}
            onJoinSuccess={handleJoinSuccess}
          />
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white px-4 py-1 rounded-lg border border-gray-300 mb-3">
          <Feather name="search" size={20} color="gray" style={{ marginRight: 8 }} />
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Search organizations..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Type Filter */}
        <View className="flex-row flex-wrap gap-2 mb-2">
          {["all", "business", "personal"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setFilterType(type as any);
              }}
              className={`px-4 py-1.5 rounded-full ${filterType === type ? "bg-[#213555]" : "bg-gray-300"
                }`}
            >
              <Text className="text-white capitalize">{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Organization Cards */}
        {filteredOrgs.length === 0 ? (
          <Text className="text-gray-500 text-center mt-20">
            No organizations match your filters.
          </Text>
        ) : (

          <View className="space-y-8 items-center">

            {/* Divider line */}
            <View className="my-4 items-center">
              <View style={{ width: 60, height: 2, backgroundColor: "#F96E2A", borderRadius: 1 }} />
            </View>

            {filteredOrgs.map((org, index) => {
              const bgColor = index % 2 === 0 ? "#213555" : "#F96E2A";
              const logoColor = index % 2 === 0 ? "#F96E2A" : "#213555";

              return (
                <TouchableOpacity
                  key={org.orgId}

                  onPress={() => {
                    const orgData = {
                      orgId: org.orgId,
                      orgName: org.orgName,
                      description: org.description || "",
                    };
                    const userRole = org.role === "admin" ? "admin" : "member";
                    router.push({
                      pathname: "/pages/organization/insideOrg",
                      params: {
                        orgData: JSON.stringify(orgData),
                        userRole,
                      },
                    });
                  }}

                  style={{
                    backgroundColor: bgColor,
                    width: 250,
                    height: 220,
                    margin: 5,
                  }}
                  className="rounded-2xl px-6 py-5"
                >
                  <View className="flex-1 justify-center items-center">
                    {/* Circle with first letter */}
                    <View
                      className="w-20 h-20 rounded-full mb-3 items-center justify-center"
                      style={{ backgroundColor: "#FBF8EF" }}

                    >
                      <Text
                        className="text-3xl text-center"
                        style={{ color: logoColor, fontFamily: "Poppins_700Bold" }}
                      >
                        {org.orgName[0]}
                      </Text>
                    </View>

                    <Text
                      className="text-white text-xl mb-1 text-center"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        fontFamily: "Poppins_700Bold",
                        maxWidth: 200,
                        textAlign: "center",
                      }}
                    >
                      {org.orgName}
                    </Text>

                    <Text className="text-white text-sm">
                      <Text style={{ fontFamily: "Poppins_700", textTransform: "capitalize" }}> {org.role} | {org.type}</Text>
                    </Text>

                  </View>
                </TouchableOpacity>
              );

            })}

            {/* Divider line */}
            <View className="my-4 items-center">
              <View style={{ width: 60, height: 2, backgroundColor: "#F96E2A", borderRadius: 1 }} />
            </View>
          </View>

        )}

      </ScrollView>

      <CreateOrgModal
        visible={showCreateModal}
        setVisible={setShowCreateModal}
        orgName={orgName}
        setOrgName={setOrgName}
        orgCode={orgCode}
        setOrgCode={setOrgCode}
        orgPassword={orgPassword}
        setOrgPassword={setOrgPassword}
        orgBody={orgBody}
        setOrgBody={setOrgBody}
        visibility={visibility}
        setVisibility={setVisibility}
        isBusiness={isBusiness}
        setIsBusiness={setIsBusiness}
        errors={errors}
        onSubmit={onCreateOrg}
        orgExistsError={orgExistsError}
        setOrgExistsError={setOrgExistsError}
      />

    </SafeAreaView>
  );
}
