import { InputFieldProps } from "@/types/type";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function InputField({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  error,
  rightIcon,
  ...props
}: InputFieldProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-1 w-full">
          <Text className={`text-sm font-JakartaSemiBold mb-2 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border ${
              error ? "border-red-500" : "border-neutral-100"
            } focus:border-primary-500 ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              className={`rounded-full p-3 font-JakartaSemiBold text-[13px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#9CA3AF"
              {...props}
            />
            {rightIcon && <View className="mr-4">{rightIcon}</View>}
          </View>
          {error && (
            <Text className="text-red-500 text-xs mt-1 ml-4">{error}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
