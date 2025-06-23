// explore organizations Page
import { View, Text, ScrollView, Modal, TouchableWithoutFeedback, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Platform } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Feather } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

type Org = {
  org_id: string;
  org_name: string;
  role: "admin" | "member";
  is_business: "business" | "personal";
  description?: string;
};

//Fetch
export default function ExploreOrgs() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "business" | "personal">("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<Org[]>([]);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch(`${API_BASE}/organizations`);
        const data = await res.json();
        const publicOrgs = data.filter((org: any) => org.visibility === "public");
        setOrgs(publicOrgs);
      } catch (err) {
        console.error("Error fetching orgs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkLogin = async () => {
        const userId = await AsyncStorage.getItem("user_id");
        setIsLoggedIn(!!userId);
      };
      checkLogin();
    }, [])
  );

  if (!fontsLoaded) return <AppLoading />;



  const filteredOrgs = orgs.filter((org) => {
    const matchesSearch = org.org_name.toLowerCase().includes(searchTerm.toLowerCase());
    const orgType = org.is_business ? "business" : "personal";
    const matchesType = filterType === "all" || orgType === filterType;
    return matchesSearch && matchesType;
  });

  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Title + Plus Button */}
        <View className="flex-row justify-between items-center mb-3">

          <Text
            className="text-2xl text-[#213555]"
            style={{ fontFamily: "Poppins_700Bold" }}
          >
            Explore Organizations
          </Text>


          <TouchableOpacity
            onPress={() => {
              if (isLoggedIn) {
                router.push("/myOrgs");
              } else {
                setShowLoginModal(true);
              }
            }}
            className="px-4 py-2 rounded-full border"
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
              My Orgs
            </Text>
          </TouchableOpacity>
        </View>

        {/* If the user not logged in and wanna reach (myOrgs)*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showLoginModal}
          onRequestClose={() => setShowLoginModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowLoginModal(false)}>
            <View className="flex-1 justify-center items-center bg-black/40">
              <TouchableWithoutFeedback>
                <View className="bg-white w-80 rounded-2xl p-6 items-center">
                  <Text
                    className="text-xl text-center text-[#333] mb-2"
                    style={{ fontFamily: "Poppins_700Bold" }}
                  >
                    You need to log in
                  </Text>

                  <Text className="text-base text-center text-[#555] mb-6">
                    to view and create organizations.
                  </Text>

                  <View className="flex-row justify-center gap-x-3">
                    <TouchableOpacity
                      onPress={() => {
                        setShowLoginModal(false);
                        router.push("/profile");
                      }}
                      className="bg-[#213555] px-4 py-2 rounded-full min-w-[100px]"
                    >
                      <Text className="text-white font-bold text-center">Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setShowLoginModal(false)}
                      className="bg-white px-4 py-2 rounded-full min-w-[100px] border"
                      style={{
                        borderColor: "#213555",
                        borderWidth: 1,
                      }}
                    >
                      <Text className="text-[#213555] text-center">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
                  key={org.org_id}
                  onPress={() => console.log("Open org:", org.org_name)}
                  style={{
                    backgroundColor: bgColor,
                    width: 250,
                    height: 220,
                    margin: 5,
                  }}
                  className="rounded-2xl px-6 py-5"
                >
                  <View className="flex-1 justify-center items-center">

                    {/* Circle with First Letter */}
                    <View
                      className="w-20 h-20 rounded-full mb-3 items-center justify-center"
                      style={{ backgroundColor: "#FBF8EF" }}

                    >
                      <Text
                        className="text-3xl text-center"
                        style={{ color: logoColor, fontFamily: "Poppins_700Bold" }}
                      >
                        {org.org_name[0]}
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
                      {org.org_name}
                    </Text>

                    <Text className="text-white text-sm">

                      <Text style={{ fontFamily: "Poppins_700", textTransform: "capitalize" }}> {org.is_business ? "business" : "personal"} Organization</Text>
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
    </SafeAreaView>
  );
}