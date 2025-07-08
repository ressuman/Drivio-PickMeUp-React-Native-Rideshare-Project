import { MaterialIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Page Not Found",
          headerStyle: {
            backgroundColor: "#1f2937",
          },
          headerTintColor: "#fff",
        }}
      />
      <View className="flex-1 bg-gray-50 justify-center items-center px-6">
        {/* Icon Container */}
        <View className="mb-8">
          <View className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-4">
            <MaterialIcons name="wrong-location" size={48} color="#3b82f6" />
          </View>
        </View>

        {/* Main Content */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Route Not Found
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-1">
            Looks like this destination doesn&apos;t exist.
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6">
            Let&apos;s get you back on track!
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="w-full max-w-sm space-y-3">
          <Link href="/" asChild>
            <Pressable className="bg-blue-600 py-4 px-6 rounded-xl active:bg-blue-700">
              <Text className="text-white text-center font-semibold text-base">
                Go to Home
              </Text>
            </Pressable>
          </Link>

          <Link href="/search" asChild>
            <Pressable className="bg-white border-2 border-blue-600 py-4 px-6 rounded-xl active:bg-blue-50">
              <Text className="text-blue-600 text-center font-semibold text-base">
                Find a Ride
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Help Text */}
        <View className="mt-8 items-center">
          <Text className="text-sm text-gray-500 text-center">
            Need help? Contact our support team
          </Text>
          <Link href="/support" asChild>
            <Pressable className="mt-2 py-2 px-4">
              <Text className="text-blue-600 text-sm font-medium underline">
                Get Support
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}
