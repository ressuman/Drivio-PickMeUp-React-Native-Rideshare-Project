import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function FindRideScreen() {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  const router = useRouter();

  return (
    <RideLayout title="Find Your Ride">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header Section */}
        <View className="mb-6">
          <LinearGradient
            colors={["#F5F8FF", "#EBF4FF"]}
            className="p-4 rounded-2xl mb-4"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center mr-3">
                <Image
                  source={icons.target}
                  className="w-6 h-6"
                  style={{ tintColor: "white" }}
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-JakartaBold text-secondary-900">
                  Where to?
                </Text>
                <Text className="text-sm font-JakartaMedium text-secondary-600">
                  Choose your pickup and destination
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* From Location */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 bg-success-500 rounded-full mr-2" />
            <Text className="text-base font-JakartaBold text-secondary-900">
              Pickup Location
            </Text>
          </View>

          <GoogleTextInput
            icon={icons.target}
            initialLocation={userAddress!}
            containerStyle="bg-general-500 border border-secondary-200"
            textInputBackgroundColor="#FFFFFF"
            handlePress={(location) => setUserLocation(location)}
            placeholder="Enter pickup location"
          />
        </View>

        {/* Destination Location */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <View className="w-3 h-3 bg-danger-500 rounded-full mr-2" />
            <Text className="text-base font-JakartaBold text-secondary-900">
              Destination
            </Text>
          </View>

          <GoogleTextInput
            icon={icons.map}
            initialLocation={destinationAddress!}
            containerStyle="bg-general-500 border border-secondary-200"
            textInputBackgroundColor="#FFFFFF"
            handlePress={(location) => setDestinationLocation(location)}
            placeholder="Where would you like to go?"
          />
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-base font-JakartaBold text-secondary-900 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-primary-100 rounded-xl p-4 items-center border border-primary-200">
              <View className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center mb-2">
                <Text className="text-white text-lg">🏠</Text>
              </View>
              <Text className="text-sm font-JakartaSemiBold text-primary-700">
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-warning-100 rounded-xl p-4 items-center border border-warning-200">
              <View className="w-10 h-10 bg-warning-500 rounded-full items-center justify-center mb-2">
                <Text className="text-white text-lg">🏢</Text>
              </View>
              <Text className="text-sm font-JakartaSemiBold text-warning-700">
                Work
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-success-100 rounded-xl p-4 items-center border border-success-200">
              <View className="w-10 h-10 bg-success-500 rounded-full items-center justify-center mb-2">
                <Text className="text-white text-lg">📍</Text>
              </View>
              <Text className="text-sm font-JakartaSemiBold text-success-700">
                Current
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ride Options Preview */}
        <View className="mb-6">
          <Text className="text-base font-JakartaBold text-secondary-900 mb-3">
            Ride Options
          </Text>
          <View className="space-y-2">
            <View className="bg-white rounded-xl p-4 border border-secondary-200 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-primary-500 text-lg">🚗</Text>
                  </View>
                  <View>
                    <Text className="font-JakartaSemiBold text-secondary-900">
                      Standard
                    </Text>
                    <Text className="text-xs font-JakartaMedium text-secondary-600">
                      Affordable everyday rides
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-JakartaBold text-primary-500">
                  $12-15
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-xl p-4 border border-secondary-200 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-warning-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-warning-500 text-lg">⭐</Text>
                  </View>
                  <View>
                    <Text className="font-JakartaSemiBold text-secondary-900">
                      Premium
                    </Text>
                    <Text className="text-xs font-JakartaMedium text-secondary-600">
                      High-end cars and top drivers
                    </Text>
                  </View>
                </View>
                <Text className="text-sm font-JakartaBold text-warning-500">
                  $18-22
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Find Ride Button */}
        <View className="mt-4">
          <CustomButton
            title="Find Available Rides"
            onPress={() => router.push(`/(root)/confirm-ride`)}
            bgVariant="primary"
            className="bg-primary-500 shadow-lg shadow-primary-500/30"
            IconLeft={() => (
              <Image
                source={icons.search}
                className="w-5 h-5 mr-2"
                style={{ tintColor: "white" }}
                resizeMode="contain"
              />
            )}
          />
        </View>

        {/* Footer Info */}
        <View className="mt-6 p-4 bg-general-600 rounded-xl border border-primary-200">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center mr-3">
              <Text className="text-white text-sm">ℹ️</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-JakartaSemiBold text-primary-700">
                Safe & Secure
              </Text>
              <Text className="text-xs font-JakartaMedium text-secondary-600">
                All rides are tracked and drivers are verified
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </RideLayout>
  );
}
