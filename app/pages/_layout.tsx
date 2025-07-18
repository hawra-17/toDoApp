import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen 
      name="organization/insideOrg" 
      options={{
        headerShown: false,
      }}
     />

      <Stack.Screen
        name="prof"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
