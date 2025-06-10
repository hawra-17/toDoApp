import { Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <>
              <Ionicons size={24} name={focused ? "home" : "home-outline"} />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="orgnization"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <>
              <Ionicons
                size={24}
                name={focused ? "people" : "people-outline"}
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <>
              <Ionicons
                size={24}
                name={focused ? "person-circle" : "person-circle-outline"}
              />
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
