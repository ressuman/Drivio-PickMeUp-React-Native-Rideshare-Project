import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import OTPInput from "@/components/OTPInput";
import PasswordStrength from "@/components/PasswordStrength";
import { icons, images } from "@/constants";
import {
  calculatePasswordStrength,
  handleResendCode,
  handleSignUp,
  handleVerification,
  validateSignUpForm,
} from "@/lib/auth";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  const onSignUpPress = async () => {
    const validation = validateSignUpForm(form);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    if (!isLoaded) {
      return;
    }

    await handleSignUp(form, signUp, setVerification, verification);
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) {
      return;
    }

    await handleVerification(
      signUp,
      setActive,
      router,
      verification,
      setVerification,
      form,
    );
  };

  const onResendCode = async () => {
    if (!isLoaded || resendCooldown > 0) {
      return;
    }

    await handleResendCode(
      signUp,
      setVerification,
      verification,
      setResendCooldown,
    );
  };

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleOTPChange = (code) => {
    setVerification({ ...verification, code, error: "" });
  };

  const handlePasswordChange = (value) => {
    setForm({ ...form, password: value });
    setPasswordStrength(calculatePasswordStrength(value));
    clearError("password");
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
            onChangeText={handlePasswordChange}
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

          {form.password.length > 0 && (
            <PasswordStrength
              password={form.password}
              passwordStrength={passwordStrength}
            />
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

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onBackdropPress={() => {
            // Optional: Allow dismissing on backdrop press
            // setVerification({ ...verification, state: "default" });
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a 6-digit verification code to {form.email}
            </Text>

            <Text className="font-JakartaSemiBold text-gray-700 mb-3">
              Enter verification code
            </Text>

            <OTPInput
              value={verification.code}
              onChangeText={handleOTPChange}
              error={verification.error}
            />

            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              className="mt-5 bg-success-500"
              disabled={verification.code.length !== 6}
            />

            <TouchableOpacity
              // onPress={() => {
              //   // Resend code logic here
              //   Alert.alert(
              //     "Code Resent",
              //     "A new verification code has been sent to your email.",
              //   );
              // }}
              onPress={onResendCode}
              disabled={resendCooldown > 0}
              className="mt-4"
            >
              <Text
                className={`text-center font-JakartaMedium ${
                  resendCooldown > 0 ? "text-gray-400" : "text-primary-500"
                }`}
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Didn't receive the code? Resend"}
              </Text>
            </TouchableOpacity>
          </View>
        </ReactNativeModal>

        {/* Success Modal */}
        <ReactNativeModal
          isVisible={verification.state === "success"}
          onBackdropPress={() => {}} // Prevent dismissing
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified!
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account. Redirecting to
              home...
            </Text>

            {/* Loading indicator */}
            <View className="flex-row justify-center mt-6">
              <View className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mx-1"></View>
              <View
                className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mx-1"
                style={{ animationDelay: "0.2s" }}
              ></View>
              <View
                className="w-2 h-2 bg-primary-500 rounded-full animate-pulse mx-1"
                style={{ animationDelay: "0.4s" }}
              ></View>
            </View>
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}
