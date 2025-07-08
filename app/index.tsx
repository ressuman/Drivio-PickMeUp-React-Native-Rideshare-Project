import { Redirect } from "expo-router";

export default function RootScreen() {
  return <Redirect href="/(auth)/welcome" />;
}
