import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function OTPInput({ value, onChangeText, error }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Update parent component
    onChangeText(newOtp.join(""));

    // Move to next input if current is filled
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index) => {
    // Clear current input on focus
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);
    onChangeText(newOtp.join(""));
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between space-x-1 mb-2">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="numeric"
            maxLength={1}
            className={`w-8 h-8 border-2 rounded-lg text-center text-sm font-JakartaBold ${
              error
                ? "border-red-500 bg-red-50"
                : digit
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 bg-white"
            }`}
            style={{
              fontSize: 12,
              textAlign: "center",
            }}
          />
        ))}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1 text-center">{error}</Text>
      )}
    </View>
  );
}
