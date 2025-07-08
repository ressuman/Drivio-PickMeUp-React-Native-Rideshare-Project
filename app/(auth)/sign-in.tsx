import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    let newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please check your email format";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Please enter your password";
    } else if (form.password.length < 8) {
      newErrors.password = "Password should be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const onSignInPress = useCallback(
    async () => {
      // if (!isLoaded) return;
      // try {
      //   const signInAttempt = await signIn.create({
      //     identifier: form.email,
      //     password: form.password,
      //   });
      //   if (signInAttempt.status === "complete") {
      //     await setActive({ session: signInAttempt.createdSessionId });
      //     router.replace("/(root)/(tabs)/home");
      //   } else {
      //     // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
      //     console.log(JSON.stringify(signInAttempt, null, 2));
      //     Alert.alert("Error", "Log in failed. Please try again.");
      //   }
      // } catch (err: any) {
      //   console.log(JSON.stringify(err, null, 2));
      //   Alert.alert("Error", err.errors[0].longMessage);
      // }
    },
    [
      //isLoaded, form
    ],
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <View className="absolute bottom-5 left-5 right-5">
            <Text className="text-2xl text-black font-JakartaSemiBold mb-1">
              Welcome Back! 👋
            </Text>
            <Text className="text-base text-gray-600 font-Jakarta">
              Great to see you again! Let's get you signed in
            </Text>
          </View>
        </View>

        <View className="px-5 py-6">
          <InputField
            label="Email Address"
            placeholder="Enter your email"
            icon={icons.email}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(value) => {
              setForm({ ...form, email: value });
              clearError("email");
            }}
            error={errors.email}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            secureTextEntry={!showPassword}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => {
              setForm({ ...form, password: value });
              clearError("password");
            }}
            error={errors.password}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-2"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity className="mt-2 mb-4">
            <Text className="text-right text-primary-500 font-JakartaMedium">
              Forgot your password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title={isLoading ? "Signing you in..." : "Sign In"}
            onPress={onSignInPress}
            className="mt-2"
            disabled={isLoading}
          />

          <OAuth />

          <View className="mt-8 p-4 bg-blue-50 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
              <Text className="ml-2 text-sm text-blue-700 font-JakartaMedium">
                Your data is secure and encrypted
              </Text>
            </View>
          </View>

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-6"
          >
            New to our community?{" "}
            <Text className="text-primary-500 font-JakartaSemiBold">
              Join Us Today
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
