import GoogleTextInput from "@/components/GoogleTextInput";
import HomeMap from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const recentRides = [
  {
    ride_id: "1",
    origin_address: "Kathmandu, Nepal",
    destination_address: "Pokhara, Nepal",
    origin_latitude: "27.717245",
    origin_longitude: "85.323961",
    destination_latitude: "28.209583",
    destination_longitude: "83.985567",
    ride_time: 391,
    fare_price: "19500.00",
    payment_status: "paid",
    driver_id: 2,
    user_id: "1",
    created_at: "2024-08-12 05:19:20.620007",
    driver: {
      driver_id: "2",
      first_name: "David",
      last_name: "Brown",
      profile_image_url:
        "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
      car_seats: 5,
      rating: "4.60",
    },
  },
  {
    ride_id: "2",
    origin_address: "Jalkot, MH",
    destination_address: "Pune, Maharashtra, India",
    origin_latitude: "18.609116",
    origin_longitude: "77.165873",
    destination_latitude: "18.520430",
    destination_longitude: "73.856744",
    ride_time: 491,
    fare_price: "24500.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 06:12:17.683046",
    driver: {
      driver_id: "1",
      first_name: "James",
      last_name: "Wilson",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "3",
    origin_address: "Zagreb, Croatia",
    destination_address: "Rijeka, Croatia",
    origin_latitude: "45.815011",
    origin_longitude: "15.981919",
    destination_latitude: "45.327063",
    destination_longitude: "14.442176",
    ride_time: 124,
    fare_price: "6200.00",
    payment_status: "paid",
    driver_id: 1,
    user_id: "1",
    created_at: "2024-08-12 08:49:01.809053",
    driver: {
      driver_id: "1",
      first_name: "James",
      last_name: "Wilson",
      profile_image_url:
        "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
      car_image_url:
        "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
      car_seats: 4,
      rating: "4.80",
    },
  },
  {
    ride_id: "4",
    origin_address: "Okayama, Japan",
    destination_address: "Osaka, Japan",
    origin_latitude: "34.655531",
    origin_longitude: "133.919795",
    destination_latitude: "34.693725",
    destination_longitude: "135.502254",
    ride_time: 159,
    fare_price: "7900.00",
    payment_status: "paid",
    driver_id: 3,
    user_id: "1",
    created_at: "2024-08-12 18:43:54.297838",
    driver: {
      driver_id: "3",
      first_name: "Michael",
      last_name: "Johnson",
      profile_image_url:
        "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
      car_image_url:
        "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
      car_seats: 4,
      rating: "4.70",
    },
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();

  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const loading = false;

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const handleSignOut = () => {
    // signOut();
    // router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        // latitude: location.coords?.latitude,
        // longitude: location.coords?.longitude,
        latitude: 37.78825,
        longitude: -122.4324,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center py-16 px-6">
            {!loading ? (
              <View className="items-center">
                <View className="w-32 h-32 bg-blue-50 rounded-full items-center justify-center mb-6">
                  <Image
                    source={images.noResult}
                    className="w-20 h-20 opacity-60"
                    alt="No recent rides found"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-xl font-JakartaSemiBold text-gray-800 mb-2">
                  No rides yet
                </Text>
                <Text className="text-gray-500 text-center text-base leading-6">
                  Your recent rides will appear here once you start booking with
                  us
                </Text>
              </View>
            ) : (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-4 font-JakartaMedium">
                  Loading your rides...
                </Text>
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={
          <View className="pb-4">
            {/* Header Section */}
            <View className="flex flex-row items-center justify-between mb-8 pt-2">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm font-JakartaMedium mb-1">
                  Good {getTimeOfDay()},
                </Text>
                <Text className="text-3xl font-JakartaExtraBold capitalize text-gray-900">
                  {user?.firstName ||
                    user?.emailAddresses[0].emailAddress.split("@")[0] ||
                    "Friend"}
                  👋
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSignOut}
                className="w-12 h-12 rounded-full bg-white shadow-lg shadow-gray-200 items-center justify-center"
                style={styles.signOutButton}
              >
                <Image source={icons.out} className="w-5 h-5" />
              </TouchableOpacity>
            </View>

            {/* Search Section */}
            <View className="mb-8">
              <Text className="text-gray-700 font-JakartaSemiBold mb-3 text-base">
                Where would you like to go?
              </Text>
              <GoogleTextInput
                icon={icons.search}
                containerStyle="bg-white shadow-lg shadow-gray-200/50 border border-gray-100"
                handlePress={handleDestinationPress}
                placeholder="Search destination..."
                initialLocation=""
                showRecentSearches={true}
                isLoading={loading}
              />
            </View>

            {/* Current Location Section */}
            <View className="mb-8">
              <View className="flex flex-row items-center justify-between mb-4">
                <Text className="text-xl font-JakartaBold text-gray-900">
                  Your Location
                </Text>
                <TouchableOpacity className="bg-blue-50 px-3 py-1 rounded-full">
                  <Text className="text-blue-600 font-JakartaSemiBold text-sm">
                    Update
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
                <View className="h-[280px] relative">
                  <HomeMap />

                  {/* Overlay gradient for better text readability */}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.1)"]}
                    className="absolute bottom-0 left-0 right-0 h-16"
                  />

                  {/* Location indicator */}
                  <View className="absolute bottom-4 left-4 right-4">
                    <BlurView
                      intensity={80}
                      className="bg-white/20 rounded-xl p-3"
                    >
                      <Text className="text-white font-JakartaSemiBold text-sm">
                        📍 Current Location
                      </Text>
                    </BlurView>
                  </View>
                </View>
              </View>
            </View>

            {/* Recent Rides Header */}
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="text-xl font-JakartaBold text-gray-900">
                Recent Rides
              </Text>
              {recentRides?.length > 0 && (
                <TouchableOpacity>
                  <Text className="text-blue-600 font-JakartaSemiBold text-sm">
                    View All
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Helper function to get time of day greeting
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

const styles = StyleSheet.create({
  signOutButton: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
});
