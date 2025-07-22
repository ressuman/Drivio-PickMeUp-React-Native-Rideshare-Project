import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function DriverCard({
  item,
  selected,
  setSelected,
}: Readonly<DriverCardProps>) {
  const isSelected = selected === item.id;

  return (
    <TouchableOpacity
      onPress={setSelected}
      className="mb-1"
      activeOpacity={0.7}
    >
      <View
        className={`
        ${isSelected ? "border-primary-500 border-2" : "border-secondary-200 border"}
        bg-white rounded-2xl overflow-hidden shadow-sm
      `}
      >
        {isSelected && (
          <LinearGradient
            colors={["#F5F8FF", "#EBF4FF"]}
            className="absolute inset-0"
          />
        )}

        <View className="p-4">
          {/* Header Row */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className="relative">
                <Image
                  source={{ uri: item.profile_image_url }}
                  className="w-12 h-12 rounded-full"
                />
                {isSelected && (
                  <View className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </View>

              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text className="text-lg font-JakartaBold text-secondary-900">
                    {item.title}
                  </Text>
                  <View className="flex-row items-center ml-2">
                    <Image source={icons.star} className="w-4 h-4" />
                    <Text className="text-sm font-JakartaSemiBold text-warning-500 ml-1">
                      4.8
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mt-1">
                  <View className="w-2 h-2 bg-success-500 rounded-full mr-2" />
                  <Text className="text-sm font-JakartaMedium text-secondary-600">
                    {item.car_seats} seats • {formatTime(item.time! ?? 0)} away
                  </Text>
                </View>
              </View>
            </View>

            <Image
              source={{ uri: item.car_image_url }}
              className="w-16 h-12 ml-3"
              resizeMode="contain"
            />
          </View>

          {/* Details Row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-primary-100 rounded-full items-center justify-center mr-2">
                  <Image
                    source={icons.dollar}
                    className="w-4 h-4"
                    style={{ tintColor: "#0066CC" }}
                  />
                </View>
                <View>
                  <Text className="text-lg font-JakartaBold text-secondary-900">
                    ${item.price ?? 0}
                  </Text>
                  <Text className="text-xs font-JakartaMedium text-secondary-600">
                    Total fare
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-success-100 rounded-full items-center justify-center mr-2">
                  <Ionicons name="time-outline" size={16} color="#059669" />
                </View>
                <View>
                  <Text className="text-sm font-JakartaSemiBold text-secondary-900">
                    {formatTime(item.time! ?? 0)}
                  </Text>
                  <Text className="text-xs font-JakartaMedium text-secondary-600">
                    Pickup time
                  </Text>
                </View>
              </View>
            </View>

            {isSelected && (
              <View className="bg-primary-500 rounded-full px-3 py-1">
                <Text className="text-white text-xs font-JakartaBold">
                  Selected
                </Text>
              </View>
            )}
          </View>

          {/* Additional Info for Selected Card */}
          {isSelected && (
            <View className="mt-3 pt-3 border-t border-primary-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-warning-100 rounded-full items-center justify-center mr-2">
                    <Text className="text-warning-500 text-xs">⭐</Text>
                  </View>
                  <Text className="text-xs font-JakartaMedium text-secondary-600">
                    Highly rated driver
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-success-100 rounded-full items-center justify-center mr-2">
                    <Text className="text-success-500 text-xs">🛡️</Text>
                  </View>
                  <Text className="text-xs font-JakartaMedium text-secondary-600">
                    Verified
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
