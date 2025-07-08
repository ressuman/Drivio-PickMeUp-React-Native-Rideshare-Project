import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Text className="bg-blue-500 text-2xl">
        Edit the home screen to edit this screen.
      </Text>
      <Pressable
        className="bg-red-500 p-4 rounded"
        onPress={() => router.push("/test-nonexistent-route")}
      >
        <Text className="text-white">Test NotFound Screen</Text>
      </Pressable>
    </SafeAreaView>
  );
}
