import { icons } from "@/constants";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeMap from "./Map";

interface RideLayoutProps {
  readonly title: string;
  readonly snapPoints?: string[];
  readonly children: React.ReactNode;
}

export default function RideLayout({
  title,
  snapPoints,
  children,
}: RideLayoutProps) {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#0286FF" />

      <View className="flex-1 bg-general-500">
        {/* Map Container with Enhanced Styling */}
        <View className="flex flex-col h-screen bg-primary-500 relative">
          {/* Header with Gradient Overlay */}
          <LinearGradient
            colors={[
              "rgba(2, 134, 255, 0.9)",
              "rgba(2, 134, 255, 0.7)",
              "transparent",
            ]}
            className="absolute top-0 left-0 right-0 z-20 h-32"
          />

          {/* Enhanced Header */}
          <View className="absolute z-30 top-12 left-0 right-0 px-5">
            <BlurView intensity={20} className="rounded-2xl overflow-hidden">
              <View className="bg-white/90 p-4 rounded-2xl border border-white/50 shadow-lg">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => router.back()}
                      className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-md mr-4"
                    >
                      <Image
                        source={icons.backArrow}
                        resizeMode="contain"
                        className="w-6 h-6"
                        style={{ tintColor: "#0286FF" }}
                      />
                    </TouchableOpacity>

                    <View className="flex-1">
                      <Text className="text-lg font-JakartaBold text-secondary-900">
                        {title || "Go Back"}
                      </Text>
                      <Text className="text-sm font-JakartaMedium text-secondary-600">
                        Find the perfect ride for you
                      </Text>
                    </View>
                  </View>

                  {/* Status Indicator */}
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-success-500 rounded-full mr-2" />
                    <Text className="text-xs font-JakartaMedium text-success-700">
                      Live
                    </Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>

          {/* Map Component */}
          <HomeMap />

          {/* Map Controls */}
          <View className="absolute top-32 right-5 z-20 space-y-3">
            <TouchableOpacity className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center border border-secondary-200">
              <Image
                source={icons.target}
                className="w-6 h-6"
                style={{ tintColor: "#0286FF" }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity className="w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center border border-secondary-200">
              <Text className="text-lg">📍</Text>
            </TouchableOpacity>
          </View>

          {/* Location Info Banner */}
          <View className="absolute bottom-20 left-5 right-5 z-20">
            <BlurView intensity={90} className="rounded-2xl overflow-hidden">
              <View className="bg-white/95 p-4 rounded-2xl border border-white/50 shadow-lg">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                      <Image
                        source={icons.map}
                        className="w-5 h-5"
                        style={{ tintColor: "#0286FF" }}
                        resizeMode="contain"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-JakartaSemiBold text-secondary-900">
                        Searching for rides...
                      </Text>
                      <Text className="text-xs font-JakartaMedium text-secondary-600">
                        Finding the best options for you
                      </Text>
                    </View>
                  </View>

                  <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-JakartaBold">
                      3
                    </Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        </View>

        {/* Enhanced Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
          backgroundStyle={{
            backgroundColor: "#F6F8FA",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
          handleIndicatorStyle={{
            backgroundColor: "#AAAAAA",
            width: 50,
            height: 5,
          }}
        >
          {/* Bottom Sheet Header */}
          <View className="px-5 pb-3 border-b border-secondary-200">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-JakartaBold text-secondary-900">
                {title === "Choose a Rider"
                  ? "Available Rides"
                  : "Ride Details"}
              </Text>
              <TouchableOpacity className="w-8 h-8 bg-secondary-200 rounded-full items-center justify-center">
                <Text className="text-secondary-600 font-JakartaBold">?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Container */}
          {title === "Choose a Rider" ? (
            <BottomSheetView
              style={{
                flex: 1,
                padding: 20,
                backgroundColor: "#F6F8FA",
              }}
            >
              <View className="flex-1">{children}</View>
            </BottomSheetView>
          ) : (
            <BottomSheetScrollView
              style={{
                flex: 1,
                padding: 20,
                backgroundColor: "#F6F8FA",
              }}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </BottomSheetScrollView>
          )}
        </BottomSheet>

        {/* Floating Action Button */}
        <View className="absolute bottom-8 right-5 z-30">
          <TouchableOpacity className="w-14 h-14 bg-primary-500 rounded-full shadow-lg shadow-primary-500/30 items-center justify-center">
            <Image
              source={icons.target}
              className="w-6 h-6"
              style={{ tintColor: "white" }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
