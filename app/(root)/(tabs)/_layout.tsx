// import { icons } from "@/constants";
// import { Tabs } from "expo-router";
// import { Image, ImageSourcePropType, View } from "react-native";

// const TabIcon = ({
//   source,
//   focused,
// }: {
//   source: ImageSourcePropType;
//   focused: boolean;
// }) => (
//   <View
//     className={`flex flex-row justify-center items-center rounded-full ${focused ? "bg-general-300" : ""}`}
//   >
//     <View
//       className={`rounded-full w-12 h-12 items-center justify-center ${focused ? "bg-general-400" : ""}`}
//     >
//       <Image
//         source={source}
//         tintColor="white"
//         resizeMode="contain"
//         className="w-7 h-7"
//       />
//     </View>
//   </View>
// );

// export default function TabsLayout() {
//   return (
//     <Tabs
//       initialRouteName="index"
//       screenOptions={{
//         tabBarActiveTintColor: "white",
//         tabBarInactiveTintColor: "white",
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           backgroundColor: "#333333",
//           borderRadius: 50,
//           paddingBottom: 0, // ios only
//           overflow: "hidden",
//           marginHorizontal: 20,
//           marginBottom: 20,
//           height: 78,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexDirection: "row",
//           position: "absolute",
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: "Home",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <TabIcon source={icons.home} focused={focused} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="rides"
//         options={{
//           title: "Rides",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <TabIcon source={icons.list} focused={focused} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: "Chat",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <TabIcon source={icons.chat} focused={focused} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <TabIcon source={icons.profile} focused={focused} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

const TabIcon = ({
  source,
  focused,
  label,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  label: string;
}) => (
  <View className="flex items-center justify-center py-2 px-3">
    {/* Icon Container with Enhanced Styling */}
    <View
      className={`rounded-2xl w-12 h-12 items-center justify-center mb-1 transition-all duration-300 ${
        focused ? "bg-blue-500 shadow-lg shadow-blue-500/25" : "bg-transparent"
      }`}
    >
      <Image
        source={source}
        tintColor={focused ? "white" : "#9CA3AF"}
        resizeMode="contain"
        className={`transition-all duration-300 ${
          focused ? "w-6 h-6" : "w-5 h-5"
        }`}
      />
    </View>

    {/* Label with Smooth Transition */}
    <Text
      className={`text-xs font-medium transition-all duration-300 ${
        focused
          ? "text-blue-500 opacity-100 scale-100"
          : "text-gray-400 opacity-70 scale-95"
      }`}
    >
      {label}
    </Text>

    {/* Active Indicator Dot */}
    {focused && (
      <View className="w-1 h-1 bg-blue-500 rounded-full mt-1 animate-pulse" />
    )}
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6", // Blue-500
        tabBarInactiveTintColor: "#9CA3AF", // Gray-400
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#1F2937", // Gray-800
          borderRadius: 24,
          paddingBottom: 8,
          paddingTop: 8,
          overflow: "hidden",
          marginHorizontal: 16,
          marginBottom: 24,
          height: 88,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          position: "absolute",
          borderTopWidth: 0,
          elevation: 20, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.25,
          shadowRadius: 25,
          // Glass morphism effect
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} label="Rides" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} label="Chat" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
