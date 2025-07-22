import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { GoogleInputProps } from "@/types/type";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// Recent searches mock data - in real app, this would come from storage
const recentSearches = [
  {
    id: 1,
    name: "Home",
    address: "123 Main St, City",
    icon: "🏠",
    color: "#0286FF",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: 2,
    name: "Work",
    address: "456 Business Ave, Downtown",
    icon: "🏢",
    color: "#EAB308",
    latitude: 40.7589,
    longitude: -73.9851,
  },
  {
    id: 3,
    name: "Airport",
    address: "International Airport Terminal",
    icon: "✈️",
    color: "#38A169",
    latitude: 40.6413,
    longitude: -73.7781,
  },
  {
    id: 4,
    name: "Mall",
    address: "Central Shopping Mall",
    icon: "🛍️",
    color: "#F56565",
    latitude: 40.7505,
    longitude: -73.9934,
  },
];

// Quick actions for common destinations
const quickActions = [
  {
    id: 1,
    title: "Home",
    icon: "🏠",
    color: "primary",
    action: "home",
  },
  {
    id: 2,
    title: "Work",
    icon: "🏢",
    color: "warning",
    action: "work",
  },
  {
    id: 3,
    title: "Current",
    icon: "📍",
    color: "success",
    action: "current",
  },
  {
    id: 4,
    title: "Saved",
    icon: "⭐",
    color: "danger",
    action: "saved",
  },
];

export default function GoogleTextInput({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  placeholder = "Where would you like to go?",
  showRecentSearches = false,
  isLoading = false,
}: Readonly<GoogleInputProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);

  // Get location store data
  const { userLatitude, userLongitude, userAddress } = useLocationStore();

  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const ref = useRef<any>(null);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  // Check if Google API key is available
  useEffect(() => {
    if (!googlePlacesApiKey) {
      console.warn("Google Places API key is not configured");
    }
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleValue, {
      toValue: 1.02,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleRecentPress = (item: any) => {
    try {
      // Add haptic feedback
      Vibration.vibrate(50);

      if (ref.current) {
        ref.current.setAddressText(item.address);
      }
      setSearchText(item.address);
      setIsFocused(false);

      // Use actual coordinates from the item
      handlePress({
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        address: item.address,
      });
    } catch (error) {
      console.error("Error handling recent press:", error);
      Alert.alert("Error", "Failed to select location");
    }
  };

  const handleQuickAction = async (action: string) => {
    try {
      Vibration.vibrate(50);

      // Handle different quick actions
      switch (action) {
        case "home":
          handleRecentPress(recentSearches[0]);
          break;
        case "work":
          handleRecentPress(recentSearches[1]);
          break;
        case "current":
          // Use current location from store
          setInternalLoading(true);

          // Simulate async location fetch
          setTimeout(() => {
            setInternalLoading(false);
            if (userLatitude && userLongitude) {
              const locationData = {
                latitude: userLatitude,
                longitude: userLongitude,
                address: userAddress || "Current Location",
              };

              handlePress(locationData);

              if (ref.current) {
                ref.current.setAddressText(userAddress || "Current Location");
              }
              setSearchText(userAddress || "Current Location");
              setIsFocused(false);
            } else {
              Alert.alert(
                "Location Unavailable",
                "Current location not available. Please enable location services.",
              );
            }
          }, 1000);
          break;
        case "saved":
          // Handle saved locations - could open a modal or navigate to saved locations
          Alert.alert("Saved Locations", "This feature is coming soon!");
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    } catch (error) {
      console.error("Error handling quick action:", error);
      Alert.alert("Error", "Failed to perform action");
    }
  };

  const clearSearch = () => {
    try {
      if (ref.current) {
        ref.current.clear();
        ref.current.setAddressText(""); // This actually clears the displayed text
      }
      setSearchText("");
      // Don't close the interface when clearing - keep it focused for new input
      Vibration.vibrate(30);
    } catch (error) {
      console.error("Error clearing search:", error);
    }
  };

  const handleSearchPress = (data: any, details: any) => {
    try {
      if (!details?.geometry?.location) {
        console.error("No location details found");
        Alert.alert("Error", "Location details not available");
        return;
      }

      setInternalLoading(true);

      const locationData = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
        address: data.description,
      };

      handlePress(locationData);

      // Close the interface after successful selection
      setIsFocused(false);
      setSearchText(data.description);
    } catch (error) {
      console.error("Error handling search press:", error);
      Alert.alert("Error", "Failed to select location");
    } finally {
      setInternalLoading(false);
    }
  };

  const currentLoading = isLoading || internalLoading;

  return (
    <View
      className={`relative z-50 ${containerStyle}`}
      style={{ overflow: "visible" }}
    >
      {/* Main Search Input */}
      <View
        className={`flex flex-row items-center bg-white rounded-2xl shadow-lg ${
          isFocused
            ? "shadow-blue-200/50 border-2 border-blue-500"
            : "shadow-gray-200/50 border border-gray-100"
        } transition-all duration-200`}
        style={{ maxWidth: "100%" }} // Prevent container from expanding beyond screen
      >
        <GooglePlacesAutocomplete
          ref={ref}
          fetchDetails={true}
          placeholder={placeholder}
          debounce={200}
          minLength={1}
          enablePoweredByContainer={false}
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: textInputBackgroundColor || "transparent",
              borderRadius: 0,
            },
            textInput: {
              backgroundColor: "transparent",
              fontSize: 16,
              fontWeight: "500",
              color: "#1f2937",
              flex: 1,
              marginLeft: 12,
              marginRight: 8,
              paddingVertical: 0,
              height: 40, // Fixed height instead of minHeight
            },
            listView: {
              backgroundColor: "white",
              borderRadius: 16,
              marginTop: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
              maxHeight: 300,
              // Removed absolute positioning to restore autocomplete functionality
            },
            row: {
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#f3f4f6",
            },
            description: {
              fontSize: 15,
              color: "#1f2937",
              fontWeight: "500",
            },
            poweredContainer: {
              display: "none",
            },
          }}
          onPress={handleSearchPress}
          query={{
            key: googlePlacesApiKey,
            language: "en",
            types: "establishment",
            components: "country:us",
          }}
          renderLeftButton={() => (
            <View className="justify-center items-center w-6 h-6 ml-2">
              <Image
                source={icon ? icon : icons.search}
                className="w-5 h-5"
                resizeMode="contain"
                style={{ tintColor: isFocused ? "#3b82f6" : "#9ca3af" }}
              />
            </View>
          )}
          renderRightButton={() => (
            <View className="flex-row items-center mr-2">
              {currentLoading && (
                <ActivityIndicator
                  size="small"
                  color="#3b82f6"
                  className="mr-2"
                />
              )}
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearch}
                  className="p-1"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-gray-400 text-lg">✕</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          textInputProps={{
            placeholderTextColor: "#9ca3af",
            placeholder: initialLocation ?? placeholder,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onChangeText: setSearchText,
            value: searchText,
            autoCapitalize: "none",
            autoCorrect: false,
            returnKeyType: "search",
          }}
        />
      </View>

      {/* Quick Actions & Recent Searches */}
      {isFocused && (
        <View className="bg-white rounded-2xl shadow-lg mt-2 p-4">
          <View className="flex-row justify-between mb-4">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="flex-1 items-center py-3 mx-1 bg-gray-50 rounded-xl"
                onPress={() => handleQuickAction(action.action)}
                disabled={currentLoading}
                style={{ opacity: currentLoading ? 0.6 : 1 }}
              >
                <Text className="text-lg mb-1">{action.icon}</Text>
                <Text className="text-xs text-gray-600 font-medium">
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Searches */}
          {showRecentSearches && (
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Recent Searches
              </Text>
              {recentSearches.map((search) => (
                <TouchableOpacity
                  key={search.id}
                  className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0"
                  onPress={() => handleRecentPress(search)}
                  disabled={currentLoading}
                  style={{ opacity: currentLoading ? 0.6 : 1 }}
                >
                  <Text className="text-lg mr-3">{search.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium">
                      {search.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {search.address}
                    </Text>
                  </View>
                  <Text className="text-gray-400">→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
