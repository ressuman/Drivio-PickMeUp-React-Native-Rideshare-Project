import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  const calculatePasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    let label = "";
    let color = "";

    if (password.length === 0) {
      label = "";
      color = "";
    } else if (score <= 2) {
      label = "Weak";
      color = "#EF4444"; // red
    } else if (score === 3) {
      label = "Fair";
      color = "#F59E0B"; // orange
    } else if (score === 4) {
      label = "Good";
      color = "#10B981"; // green
    } else {
      label = "Strong";
      color = "#059669"; // dark green
    }

    return { score, label, color, checks };
  };

  const validateForm = () => {
    let newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "We'd love to know your name!";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters)";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Your email address is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please double-check your email format";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Please create a secure password";
    } else if (form.password.length < 8) {
      newErrors.password =
        "Your password needs at least 8 characters for security";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Include uppercase, lowercase, and a number for better security";
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match - please try again";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const onSignUpPress = () => {
    if (validateForm()) {
      // Proceed with sign up logic
      console.log("Form is valid, proceeding with sign up");
      // You can add your sign up API call here
    }
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <View className="absolute bottom-5 left-5 right-5">
            <Text className="text-2xl text-black font-JakartaSemiBold mb-1">
              Join Our Community! 🚗
            </Text>
            <Text className="text-base text-gray-600 font-Jakarta">
              Create your account and start your journey with us
            </Text>
          </View>
        </View>

        <View className="px-5 py-6">
          <InputField
            label="Full Name"
            placeholder="What should we call you?"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => {
              setForm({ ...form, name: value });
              clearError("name");
            }}
            error={errors.name}
          />

          <InputField
            label="Email Address"
            placeholder="your.email@example.com"
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
            label="Create Password"
            placeholder="Choose a strong password"
            icon={icons.lock}
            secureTextEntry={!showPassword}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => {
              setForm({ ...form, password: value });
              setPasswordStrength(calculatePasswordStrength(value));
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

          {/* Password Strength Meter */}
          {form.password.length > 0 && (
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
                    color={
                      passwordStrength.checks.length ? "#10B981" : "#EF4444"
                    }
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
                    color={
                      passwordStrength.checks.uppercase ? "#10B981" : "#EF4444"
                    }
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
                    color={
                      passwordStrength.checks.lowercase ? "#10B981" : "#EF4444"
                    }
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
                    color={
                      passwordStrength.checks.number ? "#10B981" : "#EF4444"
                    }
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
                    color={
                      passwordStrength.checks.special ? "#10B981" : "#EF4444"
                    }
                  />
                  <Text className="ml-2 text-sm text-gray-600">
                    One special character (!@#$%^&*)
                  </Text>
                </View>
              </View>
            </View>
          )}

          <InputField
            label="Confirm Password"
            placeholder="Re-enter your password"
            icon={icons.lock}
            secureTextEntry={!showConfirmPassword}
            textContentType="password"
            value={form.confirmPassword}
            onChangeText={(value) => {
              setForm({ ...form, confirmPassword: value });
              clearError("confirmPassword");
            }}
            error={errors.confirmPassword}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            }
          />

          <CustomButton
            title="Create My Account"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />

          <View className="mt-8 p-4 bg-gray-50 rounded-lg">
            <Text className="text-center text-sm text-gray-600 font-Jakarta">
              By creating an account, you agree to our{" "}
              <Text className="text-primary-500 font-JakartaMedium">
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text className="text-primary-500 font-JakartaMedium">
                Privacy Policy
              </Text>
            </Text>
          </View>

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-6"
          >
            Already part of our community?{" "}
            <Text className="text-primary-500 font-JakartaSemiBold">
              Sign In
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
