// My organizations Page
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Platform } from "react-native";
import { useFonts, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Feather } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import { useRouter } from "expo-router";
import React, { useState , useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import CreateOrgModal from "../../component/orgs/CreateOrgModal";
import JoinOrgModal from "../../component/orgs/joinOrgModal";

const user = { loggedIn: 0 }; //Real check later

const allOrgs = [ //Fetch
  {
    orgId: "2",
    orgName: "Study",
    role: "member",
    type: "personal",
    description: "Private study group",
  },
  {
    orgId: "3",
    orgName: "AIP",
    role: "admin",
    type: "business",
    industry: "Tech",
    
  },
];

//Fetch
const industries = ["Tech", "Retail", "Health", "Finance", "Education", "Other"];

export default function myOrgs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "business" | "personal">("all");
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const navigation = useNavigation();
  
  //joinModal
  const [showJoinModal, setShowJoinModal] = useState(false);

  // States to control (Create) Modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [errors, setErrors] = useState({
    orgName: false,
    orgCode: false,
    businessName: false,
  });
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [orgBody, setOrgBody] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isBusiness, setIsBusiness] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [industry, setIndustry] = useState<"Tech" | "Retail" | "Health" | "Finance" | "Education" | "Other">("Tech");
  const [contactEmail, setContactEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    // Let user pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLogoUrl(uri); // Auto-fill input + display preview
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;

  const filteredOrgs = allOrgs.filter((org) => {
    const matchesSearch = org.orgName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || org.type === filterType;
    const matchesIndustry =
      filterType !== "business" || !industryFilter || org.industry === industryFilter;
    return matchesSearch && matchesType && matchesIndustry;
  });

const router = useRouter();

function handleJoinSuccess({ orgData, userRole }: { orgData: any; userRole: "admin" | "member" }) {
  console.log("Joined org successfully:", orgData);
  router.push({
    pathname: "/pages/organization/insideOrg",
    params: {
      orgData: JSON.stringify(orgData),
      userRole,
    },
  });
}

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
              setIndustryFilter(null);
            }}
            className={`px-4 py-1.5 rounded-full ${
              filterType === type ? "bg-[#213555]" : "bg-gray-300"
            }`}
          >
            <Text className="text-white capitalize">{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Industry Filter (Only if business) */}
      {filterType === "business" && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {industries.map((industry) => (
              <TouchableOpacity
                key={industry}
                onPress={() =>
                  setIndustryFilter(industryFilter === industry ? null : industry)
                }
                className={`px-4 py-0.5 rounded-full ${
                  industryFilter === industry ? "bg-[#F96E2A]" : "bg-gray-300"
                }`}
              >
                <Text className="text-white font-medium">{industry}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}


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

                  {org.type === "business" && (
                    <Text className="text-white text-sm mt-1 italic">
                      {org.industry}
                    </Text>
                  )}
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
      businessName={businessName}
      setBusinessName={setBusinessName}
      websiteURL={websiteURL}
      setWebsiteURL={setWebsiteURL}
      industry={industry}
      setIndustry={setIndustry}
      contactEmail={contactEmail}
      setContactEmail={setContactEmail}
      logoUrl={logoUrl}
      setLogoUrl={setLogoUrl}
      pickImage={pickImage}
      errors={errors}
      onSubmit={() => {
      const newErrors = {
        orgName: !orgName.trim(),
        orgCode: !orgCode.trim(),
        businessName: isBusiness && !businessName.trim(),
      };
      setErrors(newErrors);

      // Prevent submit if any errors
      if (Object.values(newErrors).some(Boolean)) {
        return;
      }

      // no error?
      const newOrg = {
        orgName,
        orgCode,
        orgPassword,
        orgBody,
        visibility,
        isBusiness,
        businessName,
        websiteURL,
        industry,
        contactEmail,
        logoUrl,
      };

      console.log("Creating org:", newOrg);

      // call API to save org here

      setShowCreateModal(false);
      // reset fields after close
      setOrgName("");
      setOrgCode("");
      setOrgPassword("");
      setOrgBody("");
      setBusinessName("");
      setWebsiteURL("");
      setContactEmail("");
      setLogoUrl("");
    }}
    />
    
  </SafeAreaView>
  );
}
