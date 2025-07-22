import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function RideCard({ ride }: { ride: Ride }) {
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-success-600 bg-success-100";
      case "pending":
        return "text-warning-600 bg-warning-100";
      case "failed":
        return "text-danger-600 bg-danger-100";
      default:
        return "text-secondary-700 bg-secondary-100";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "✅";
      case "pending":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "💳";
    }
  };

  return (
    <TouchableOpacity className="mb-4 mx-1" activeOpacity={0.8}>
      <View className="bg-white rounded-2xl shadow-lg shadow-secondary-200/50 border border-secondary-100 overflow-hidden">
        {/* Header Section with Map */}
        <View className="p-4 pb-3">
          <View className="flex flex-row items-start gap-4">
            {/* Map Thumbnail */}
            <View className="relative">
              <Image
                source={{
                  uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                }}
                className="w-20 h-20 rounded-xl"
              />
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">📍</Text>
              </View>
            </View>

            {/* Route Information */}
            <View className="flex-1">
              <View className="flex flex-row items-center gap-2 mb-3">
                <View className="w-3 h-3 bg-success-500 rounded-full" />
                <Image source={icons.to} className="w-5 h-5" />
                <Text
                  className="text-sm font-JakartaSemiBold text-secondary-900 flex-1"
                  numberOfLines={1}
                >
                  {ride.origin_address}
                </Text>
              </View>

              <View className="flex flex-row items-center gap-2">
                <View className="w-3 h-3 bg-danger-500 rounded-full" />
                <Image source={icons.point} className="w-5 h-5" />
                <Text
                  className="text-sm font-JakartaSemiBold text-secondary-900 flex-1"
                  numberOfLines={1}
                >
                  {ride.destination_address}
                </Text>
              </View>

              {/* Route line */}
              <View className="absolute left-1.5 top-6 w-0.5 h-3 bg-secondary-300" />
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View className="bg-secondary-100/50 p-4 space-y-3">
          {/* Date & Time */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center">
                <Text className="text-sm">📅</Text>
              </View>
              <Text className="text-sm font-JakartaMedium text-secondary-600">
                Trip Date
              </Text>
            </View>
            <Text className="text-sm font-JakartaBold text-secondary-900">
              {formatDate(ride.created_at)}
            </Text>
          </View>

          {/* Time */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                <Text className="text-sm">⏰</Text>
              </View>
              <Text className="text-sm font-JakartaMedium text-secondary-600">
                Departure
              </Text>
            </View>
            <Text className="text-sm font-JakartaBold text-secondary-900">
              {formatTime(ride.ride_time)}
            </Text>
          </View>

          {/* Driver Info */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <View className="w-8 h-8 bg-warning-100 rounded-full items-center justify-center">
                <Text className="text-sm">👤</Text>
              </View>
              <Text className="text-sm font-JakartaMedium text-secondary-600">
                Driver
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Text className="text-sm font-JakartaBold text-secondary-900">
                {ride.driver.first_name} {ride.driver.last_name}
              </Text>
              <View className="w-2 h-2 bg-success-500 rounded-full" />
            </View>
          </View>

          {/* Car Seats */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <View className="w-8 h-8 bg-indigo-100 rounded-full items-center justify-center">
                <Text className="text-sm">🚗</Text>
              </View>
              <Text className="text-sm font-JakartaMedium text-secondary-600">
                Capacity
              </Text>
            </View>
            <Text className="text-sm font-JakartaBold text-secondary-900">
              {ride.driver.car_seats} seats
            </Text>
          </View>

          {/* Payment Status */}
          <View className="flex flex-row items-center justify-between pt-2">
            <View className="flex flex-row items-center gap-2">
              <View className="w-8 h-8 bg-success-100 rounded-full items-center justify-center">
                <Text className="text-sm">💳</Text>
              </View>
              <Text className="text-sm font-JakartaMedium text-secondary-600">
                Payment
              </Text>
            </View>
            <View
              className={`px-3 py-1.5 rounded-full ${getPaymentStatusColor(ride.payment_status).split(" ")[1]}`}
            >
              <Text
                className={`text-xs font-JakartaBold capitalize ${getPaymentStatusColor(ride.payment_status).split(" ")[0]}`}
              >
                {getPaymentStatusIcon(ride.payment_status)}{" "}
                {ride.payment_status}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer with subtle gradient */}
        <LinearGradient
          colors={["transparent", "rgba(59, 130, 246, 0.05)"]}
          className="h-1"
        />
      </View>
    </TouchableOpacity>
  );
}
