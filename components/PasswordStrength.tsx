import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function PasswordStrength({ password, passwordStrength }) {
  return (
    <View className="mx-4 mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-JakartaSemiBold text-gray-700">
          Password Strength
        </Text>
        <Text
          className="text-sm font-JakartaBold"
          style={{ color: passwordStrength.color }}
        >
          {passwordStrength.label}
        </Text>
      </View>

      {/* Strength Bar */}
      <View className="flex-row space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <View
            key={index}
            className="flex-1 h-2 rounded-full"
            style={{
              backgroundColor:
                index <= passwordStrength.score
                  ? passwordStrength.color
                  : "#E5E7EB",
            }}
          />
        ))}
      </View>

      {/* Requirements Checklist */}
      <View className="space-y-1">
        <Text className="text-xs text-gray-500 mb-1 font-JakartaMedium">
          Password requirements:
        </Text>
        <View className="flex-row items-center">
          <Ionicons
            name={
              passwordStrength.checks.length
                ? "checkmark-circle"
                : "close-circle"
            }
            size={16}
            color={passwordStrength.checks.length ? "#10B981" : "#EF4444"}
          />
          <Text className="ml-2 text-sm text-gray-600">
            At least 8 characters
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name={
              passwordStrength.checks.uppercase
                ? "checkmark-circle"
                : "close-circle"
            }
            size={16}
            color={passwordStrength.checks.uppercase ? "#10B981" : "#EF4444"}
          />
          <Text className="ml-2 text-sm text-gray-600">
            One uppercase letter (A-Z)
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name={
              passwordStrength.checks.lowercase
                ? "checkmark-circle"
                : "close-circle"
            }
            size={16}
            color={passwordStrength.checks.lowercase ? "#10B981" : "#EF4444"}
          />
          <Text className="ml-2 text-sm text-gray-600">
            One lowercase letter (a-z)
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name={
              passwordStrength.checks.number
                ? "checkmark-circle"
                : "close-circle"
            }
            size={16}
            color={passwordStrength.checks.number ? "#10B981" : "#EF4444"}
          />
          <Text className="ml-2 text-sm text-gray-600">
            At least one number
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons
            name={
              passwordStrength.checks.special
                ? "checkmark-circle"
                : "close-circle"
            }
            size={16}
            color={passwordStrength.checks.special ? "#10B981" : "#EF4444"}
          />
          <Text className="ml-2 text-sm text-gray-600">
            One special character (!@#$%^&*)
          </Text>
        </View>
      </View>
    </View>
  );
}
