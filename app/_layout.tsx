import { Stack } from "expo-router";
import "../global.css";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pages"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
