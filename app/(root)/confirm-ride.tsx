import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useDriverStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmRideScreen() {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  const router = useRouter();

  return (
    <RideLayout title={"Choose Your Ride"} snapPoints={["65%", "85%"]}>
      <View className="flex-1">
        {/* Header Section */}
        <View className="mb-6 mx-5">
          <LinearGradient
            colors={["#F5F8FF", "#EBF4FF"]}
            className="p-4 rounded-2xl"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center mr-3">
                {/* <Image
                  source={icons.car}
                  className="w-6 h-6"
                  style={{ tintColor: "white" }}
                  resizeMode="contain"
                /> */}
                <Ionicons name="car-outline" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-JakartaBold text-secondary-900">
                  Available Rides
                </Text>
                <Text className="text-sm font-JakartaMedium text-secondary-600">
                  {drivers?.length} drivers found nearby
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Filter Options */}
        <View className="mb-4 mx-5">
          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-primary-100 border border-primary-200 rounded-full px-4 py-2">
              <Text className="text-sm font-JakartaSemiBold text-primary-700">
                Fastest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-secondary-200 rounded-full px-4 py-2">
              <Text className="text-sm font-JakartaSemiBold text-secondary-600">
                Cheapest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white border border-secondary-200 rounded-full px-4 py-2">
              <Text className="text-sm font-JakartaSemiBold text-secondary-600">
                Premium
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Driver List */}
        <FlatList
          data={drivers}
          keyExtractor={(item) =>
            item.id?.toString() ?? Math.random().toString()
          }
          renderItem={({ item, index }) => (
            <DriverCard
              item={item}
              selected={selectedDriver!}
              setSelected={() => setSelectedDriver(Number(item.id!))}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListFooterComponent={() => (
            <View className="mt-6 mb-4">
              <CustomButton
                title="Select Ride"
                onPress={() => router.push("/(root)/book-ride")}
                bgVariant="primary"
                className="bg-primary-500 shadow-lg shadow-primary-500/30"
                IconLeft={() => (
                  <Image
                    source={icons.checkmark}
                    className="w-5 h-5 mr-2"
                    style={{ tintColor: "white" }}
                    resizeMode="contain"
                  />
                )}
              />

              {/* Info Footer */}
              <View className="mt-4 p-3 bg-general-600 rounded-xl border border-primary-200">
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-success-500 rounded-full items-center justify-center mr-2">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                  <Text className="text-xs font-JakartaMedium text-secondary-600 flex-1">
                    Driver will arrive at your pickup location
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </RideLayout>
  );
}
