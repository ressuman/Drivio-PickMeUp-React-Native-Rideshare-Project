import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { useDriverStore, useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { StripeProvider } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, Text, View } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const merchantIdentifier = process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER!;
const urlScheme = process.env.EXPO_PUBLIC_STRIPE_WEBSITE_URL_SCHEME!;

export default function BookRideScreen() {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.filter(
    (driver) => +driver.id === selectedDriver,
  )[0];

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier={merchantIdentifier} // required for Apple Pay
      urlScheme={urlScheme} // required for 3D Secure and bank redirects
    >
      {/* Your app code here */}
      <RideLayout title="Book Your Ride">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header Section */}
          <View className="mb-6 mx-5">
            <LinearGradient
              colors={["#F5F8FF", "#EBF4FF"]}
              className="p-4 rounded-2xl"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-success-500 rounded-full items-center justify-center mr-3">
                  <Image
                    source={icons.checkmark}
                    className="w-6 h-6"
                    style={{ tintColor: "white" }}
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-JakartaBold text-secondary-900">
                    Ride Confirmed
                  </Text>
                  <Text className="text-sm font-JakartaMedium text-secondary-600">
                    Review details and complete booking
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Driver Information Card */}
          <View className="mx-5 mb-6">
            <Text className="text-base font-JakartaBold text-secondary-900 mb-3">
              Your Driver
            </Text>

            <View className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200">
              <View className="flex-col items-center">
                <View className="relative">
                  <Image
                    source={{ uri: driverDetails?.profile_image_url }}
                    className="w-20 h-20 rounded-full"
                  />
                  <View className="absolute -bottom-2 -right-2 w-8 h-8 bg-success-500 rounded-full items-center justify-center border-2 border-white">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                </View>

                <View className="items-center mt-4">
                  <Text className="text-xl font-JakartaBold text-secondary-900">
                    {driverDetails?.title}
                  </Text>

                  <View className="flex-row items-center mt-2">
                    <Image source={icons.star} className="w-4 h-4" />
                    <Text className="text-sm font-JakartaSemiBold text-warning-500 ml-1">
                      {driverDetails?.rating || "4.8"}
                    </Text>
                    <View className="w-1 h-1 bg-secondary-400 rounded-full mx-2" />
                    <Text className="text-sm font-JakartaMedium text-secondary-600">
                      {driverDetails?.car_seats} seats
                    </Text>
                  </View>
                </View>

                {/* Car Image */}
                <View className="mt-4 p-3 bg-general-600 rounded-xl w-full items-center">
                  <Image
                    source={{ uri: driverDetails?.car_image_url }}
                    className="w-24 h-16"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Trip Details Card */}
          <View className="mx-5 mb-6">
            <Text className="text-base font-JakartaBold text-secondary-900 mb-3">
              Trip Details
            </Text>

            <View className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
              {/* Pickup Location */}
              <View className="p-4 border-b border-secondary-100">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-success-100 rounded-full items-center justify-center mr-3">
                    <View className="w-3 h-3 bg-success-500 rounded-full" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-JakartaSemiBold text-secondary-900">
                      Pickup Location
                    </Text>
                    <Text className="text-sm font-JakartaMedium text-secondary-600 mt-1">
                      {userAddress}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Destination */}
              <View className="p-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-danger-100 rounded-full items-center justify-center mr-3">
                    <View className="w-3 h-3 bg-danger-500 rounded-full" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-JakartaSemiBold text-secondary-900">
                      Destination
                    </Text>
                    <Text className="text-sm font-JakartaMedium text-secondary-600 mt-1">
                      {destinationAddress}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Ride Summary Card */}
          <View className="mx-5 mb-6">
            <Text className="text-base font-JakartaBold text-secondary-900 mb-3">
              Ride Summary
            </Text>

            <View className="bg-white rounded-2xl shadow-sm border border-secondary-200">
              {/* Price */}
              <View className="flex-row items-center justify-between p-4 border-b border-secondary-100">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-3">
                    <Image
                      source={icons.dollar}
                      className="w-4 h-4"
                      style={{ tintColor: "#0066CC" }}
                    />
                  </View>
                  <Text className="text-base font-JakartaSemiBold text-secondary-900">
                    Total Fare
                  </Text>
                </View>
                <Text className="text-lg font-JakartaBold text-success-500">
                  ${driverDetails?.price ?? 100}
                </Text>
              </View>

              {/* Pickup Time */}
              <View className="flex-row items-center justify-between p-4 border-b border-secondary-100">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-warning-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="time-outline" size={16} color="#F59E0B" />
                  </View>
                  <Text className="text-base font-JakartaSemiBold text-secondary-900">
                    Pickup Time
                  </Text>
                </View>
                <Text className="text-base font-JakartaBold text-secondary-900">
                  {formatTime(driverDetails?.time! ?? 5)}
                </Text>
              </View>

              {/* Payment Method */}
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-success-100 rounded-full items-center justify-center mr-3">
                      <Text className="text-success-500 text-sm">💳</Text>
                    </View>
                    <Text className="text-base font-JakartaSemiBold text-secondary-900">
                      Payment Method
                    </Text>
                  </View>
                  <Text className="text-base font-JakartaMedium text-secondary-600">
                    Card Payment
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Safety Info */}
          <View className="mx-5 mb-6">
            <View className="p-4 bg-general-600 rounded-xl border border-primary-200">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-sm">🛡️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-JakartaSemiBold text-primary-700">
                    Safe & Secure Ride
                  </Text>
                  <Text className="text-xs font-JakartaMedium text-secondary-600">
                    Your trip is tracked and driver is verified
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Component */}
          <View className="mx-5">
            <Payment
              fullName={user?.fullName!}
              email={user?.emailAddresses[0].emailAddress!}
              amount={driverDetails?.price!}
              driverId={driverDetails?.id}
              rideTime={driverDetails?.time!}
            />
          </View>
        </ScrollView>
      </RideLayout>
    </StripeProvider>
  );
}
