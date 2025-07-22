import { icons } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { MarkerData } from "@/types/type";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const drivers = [
  {
    id: "1",
    first_name: "James",
    last_name: "Wilson",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: "4.80",
  },
  {
    id: "2",
    first_name: "David",
    last_name: "Brown",
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    car_seats: 5,
    rating: "4.60",
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Johnson",
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    car_seats: 4,
    rating: "4.70",
  },
  {
    id: "4",
    first_name: "Robert",
    last_name: "Green",
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    car_seats: 4,
    rating: "4.90",
  },
];

export default function HomeMap() {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();

  // const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [mapType, setMapType] = useState<"standard" | "satellite" | "hybrid">(
    "standard",
  );
  const [showTraffic, setShowTraffic] = useState(false);

  useEffect(() => {
    setDrivers(drivers);

    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  // useEffect(() => {
  //   if (
  //     markers.length > 0 &&
  //     destinationLatitude !== undefined &&
  //     destinationLongitude !== undefined
  //   ) {
  //     calculateDriverTimes({
  //       markers,
  //       userLatitude,
  //       userLongitude,
  //       destinationLatitude,
  //       destinationLongitude,
  //     }).then((drivers) => {
  //       setDrivers(drivers as MarkerData[]);
  //     });
  //   }
  // }, [markers, destinationLatitude, destinationLongitude]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  // const toggleMapType = () => {
  //   setMapType((prev) =>
  //     prev === "standard"
  //       ? "satellite"
  //       : prev === "satellite"
  //         ? "hybrid"
  //         : "standard",
  //   );
  // };

  // if (loading || (!userLatitude && !userLongitude))
  //   return (
  //     <View className="flex-1 justify-center items-center bg-general-500 rounded-2xl">
  //       <LinearGradient
  //         colors={["#F5F8FF", "#EBF4FF"]}
  //         className="flex-1 w-full items-center justify-center rounded-2xl"
  //       >
  //         <View className="items-center space-y-4">
  //           <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center">
  //             <ActivityIndicator size="large" color="#0286FF" />
  //           </View>
  //           <Text className="text-primary-700 font-JakartaSemiBold text-base">
  //             Loading your location...
  //           </Text>
  //           <Text className="text-secondary-600 font-JakartaMedium text-sm text-center px-6">
  //             We're finding the best drivers in your area
  //           </Text>
  //         </View>
  //       </LinearGradient>
  //     </View>
  //   );

  // if (error)
  //   return (
  //     <View className="flex-1 justify-center items-center bg-general-500 rounded-2xl">
  //       <LinearGradient
  //         colors={["#FFF5F5", "#FED7D7"]}
  //         className="flex-1 w-full items-center justify-center rounded-2xl"
  //       >
  //         <View className="items-center space-y-4">
  //           <View className="w-16 h-16 bg-danger-100 rounded-full items-center justify-center">
  //             <Text className="text-danger-600 text-2xl">⚠️</Text>
  //           </View>
  //           <Text className="text-danger-700 font-JakartaSemiBold text-base">
  //             Unable to load map
  //           </Text>
  //           <Text className="text-danger-600 font-JakartaMedium text-sm text-center px-6">
  //             {error}
  //           </Text>
  //           <TouchableOpacity className="bg-danger-600 px-6 py-3 rounded-xl">
  //             <Text className="text-white font-JakartaSemiBold">Try Again</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </LinearGradient>
  //     </View>
  //   );

  return (
    <View className="flex-1 relative rounded-2xl overflow-hidden">
      <MapView
        provider={PROVIDER_DEFAULT}
        className="w-full h-full"
        mapType={mapType}
        showsPointsOfInterest={false}
        showsTraffic={showTraffic}
        initialRegion={region}
        //showsUserLocation={true}
        userInterfaceStyle="light"
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={`Driver available • ${marker.time || "Calculating..."}`}
            image={
              selectedDriver === +marker.id
                ? icons.selectedMarker
                : icons.marker
            }
          />
        ))}

        {/* {destinationLatitude && destinationLongitude && (
          <>
            <Marker
              key="destination"
              coordinate={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              title="Your destination"
              description="Drop-off location"
              image={icons.pin}
            />
            <MapViewDirections
              origin={{
                latitude: userLatitude!,
                longitude: userLongitude!,
              }}
              destination={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              apikey={directionsAPI!}
              strokeColor="#0286FF"
              strokeWidth={4}
              lineDashPattern={[0]}
              optimizeWaypoints={true}
              splitWaypoints={false}
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`,
                );
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
              }}
            />
          </>
        )} */}
      </MapView>

      {/* Map Controls */}
      <View className="absolute top-4 right-4 space-y-2">
        {/* Map Type Toggle */}
        <TouchableOpacity
          //onPress={toggleMapType}
          className="w-12 h-12 bg-white rounded-full shadow-lg shadow-secondary-300 items-center justify-center border border-secondary-200"
        >
          <Text className="text-lg">
            {/* {mapType === "standard"
              ? "🗺️"
              : mapType === "satellite"
                ? "🛰️"
                : "🌍"} */}
          </Text>
        </TouchableOpacity>

        {/* Traffic Toggle */}
        {/* <TouchableOpacity
          onPress={() => setShowTraffic(!showTraffic)}
          className={`w-12 h-12 rounded-full shadow-lg shadow-secondary-300 items-center justify-center border ${
            showTraffic
              ? "bg-primary-500 border-primary-400"
              : "bg-white border-secondary-200"
          }`}
        >
          <Text className="text-lg">{showTraffic ? "🚦" : "🚥"}</Text>
        </TouchableOpacity> */}
      </View>

      {/* Driver Count Indicator */}
      {/* {markers.length > 0 && (
        <View className="absolute top-4 left-4">
          <BlurView
            intensity={90}
            className="bg-white/20 rounded-2xl overflow-hidden"
          >
            <View className="bg-primary-500/90 px-4 py-2 rounded-2xl">
              <Text className="text-white font-JakartaSemiBold text-sm">
                {markers.length} driver{markers.length !== 1 ? "s" : ""} nearby
              </Text>
            </View>
          </BlurView>
        </View>
      )} */}

      {/* Route Info */}
      {/* {destinationLatitude && destinationLongitude && (
        <View className="absolute bottom-4 left-4 right-4">
          <BlurView
            intensity={90}
            className="bg-white/20 rounded-2xl overflow-hidden"
          >
            <View className="bg-white/90 p-4 rounded-2xl border border-secondary-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-2">
                  <View className="w-3 h-3 bg-success-500 rounded-full" />
                  <Text className="font-JakartaSemiBold text-secondary-800">
                    Route Active
                  </Text>
                </View>
                <TouchableOpacity className="bg-primary-500 px-3 py-1 rounded-full">
                  <Text className="text-white font-JakartaSemiBold text-xs">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-secondary-600 font-JakartaMedium text-sm mt-1">
                Follow the blue line to your destination
              </Text>
            </View>
          </BlurView>
        </View>
      )} */}

      {/* Gradient Overlay for better contrast */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.05)"]}
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
      />
    </View>
  );
}
