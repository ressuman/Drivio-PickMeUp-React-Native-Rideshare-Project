import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import OTPInput from "@/components/OTPInput";
import PasswordStrength from "@/components/PasswordStrength";
import { icons, images } from "@/constants";
import {
  calculatePasswordStrength,
  handleForgotPassword,
  handlePasswordReset,
  handleResendResetCode,
  handleSignIn,
  validateForgotPasswordForm,
  validateResetPasswordForm,
  validateSignInForm,
} from "@/lib/auth";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Forgot password states
  const [forgotPassword, setForgotPassword] = useState({
    state: "default", // default, request, reset, success
    email: "",
    error: "",
  });

  const [resetForm, setResetForm] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const [resetErrors, setResetErrors] = useState({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const [resetPasswordStrength, setResetPasswordStrength] = useState({
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

  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const clearResetError = (field: keyof typeof resetErrors) => {
    if (resetErrors[field]) {
      setResetErrors({ ...resetErrors, [field]: "" });
    }
  };

  const onSignInPress = useCallback(async () => {
    setIsLoading(true);
    const validation = validateSignInForm(form);
    setErrors(validation.errors);

    if (!validation.isValid) {
      setIsLoading(false);
      return;
    }

    if (!isLoaded) {
      setIsLoading(false);
      return;
    }

    await handleSignIn(form, signIn, setActive, router, setErrors, errors);
    setIsLoading(false);
  }, [form, isLoaded, errors]);

  // Handle forgot password request
  const onForgotPasswordPress = () => {
    setForgotPassword({
      state: "request",
      email: form.email, // Pre-fill if email is entered
      error: "",
    });
  };

  const onSendResetCodePress = async () => {
    const validation = validateForgotPasswordForm(forgotPassword.email);

    if (!validation.isValid) {
      setForgotPassword({
        ...forgotPassword,
        error: validation.error,
      });
      return;
    }

    if (!isLoaded) {
      return;
    }

    await handleForgotPassword(
      forgotPassword.email,
      signIn,
      setForgotPassword,
      forgotPassword,
    );
  };

  const onResetPasswordPress = async () => {
    const validation = validateResetPasswordForm(resetForm);
    setResetErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    if (!isLoaded) {
      return;
    }

    await handlePasswordReset(
      resetForm,
      signIn,
      setActive,
      router,
      setForgotPassword,
      forgotPassword,
    );
  };

  const onResendResetCode = async () => {
    if (!isLoaded || resendCooldown > 0) {
      return;
    }

    await handleResendResetCode(
      forgotPassword.email,
      signIn,
      setForgotPassword,
      forgotPassword,
      setResendCooldown,
    );
  };

  const handleResetPasswordChange = (value) => {
    setResetForm({ ...resetForm, password: value });
    setResetPasswordStrength(calculatePasswordStrength(value));
    clearResetError("password");
  };

  const handleOTPChange = (code) => {
    setResetForm({ ...resetForm, code });
    clearResetError("code");
  };

  const closeForgotPasswordModal = () => {
    setForgotPassword({
      state: "default",
      email: "",
      error: "",
    });
    setResetForm({
      code: "",
      password: "",
      confirmPassword: "",
    });
    setResetErrors({
      code: "",
      password: "",
      confirmPassword: "",
    });
    setResetPasswordStrength({
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
    setResendCooldown(0);
  };

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

          <TouchableOpacity
            className="mt-2 mb-4"
            onPress={onForgotPasswordPress}
          >
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

        {/* Forgot Password Request Modal */}
        <ReactNativeModal
          isVisible={forgotPassword.state === "request"}
          onBackdropPress={closeForgotPasswordModal}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-JakartaExtraBold text-2xl">
                Reset Password
              </Text>
              <TouchableOpacity onPress={closeForgotPasswordModal}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="font-Jakarta mb-5 text-gray-600">
              Enter your email address and we'll send you a code to reset your
              password.
            </Text>

            <InputField
              label="Email Address"
              placeholder="Enter your email"
              icon={icons.email}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              value={forgotPassword.email}
              onChangeText={(value) => {
                setForgotPassword({
                  ...forgotPassword,
                  email: value,
                  error: "",
                });
              }}
              error={forgotPassword.error}
            />

            <CustomButton
              title="Send Reset Code"
              onPress={onSendResetCodePress}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>

        {/* Reset Password Modal */}
        <ReactNativeModal
          isVisible={forgotPassword.state === "reset"}
          onBackdropPress={() => {}} // Prevent dismissing during reset
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[400px]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-JakartaExtraBold text-2xl">
                Reset Password
              </Text>
              <TouchableOpacity onPress={closeForgotPasswordModal}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="font-Jakarta mb-5 text-gray-600">
              We've sent a 6-digit code to {forgotPassword.email}. Enter the
              code and your new password below.
            </Text>

            <Text className="font-JakartaSemiBold text-gray-700 mb-3">
              Enter verification code
            </Text>

            <OTPInput
              value={resetForm.code}
              onChangeText={handleOTPChange}
              error={resetErrors.code}
            />

            <InputField
              label="New Password"
              placeholder="Enter your new password"
              icon={icons.lock}
              secureTextEntry={!showNewPassword}
              textContentType="newPassword"
              value={resetForm.password}
              onChangeText={handleResetPasswordChange}
              error={resetErrors.password}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  className="p-2"
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              }
            />

            {resetForm.password.length > 0 && (
              <PasswordStrength
                password={resetForm.password}
                passwordStrength={resetPasswordStrength}
              />
            )}

            <InputField
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              icon={icons.lock}
              secureTextEntry={!showConfirmPassword}
              textContentType="newPassword"
              value={resetForm.confirmPassword}
              onChangeText={(value) => {
                setResetForm({ ...resetForm, confirmPassword: value });
                clearResetError("confirmPassword");
              }}
              error={resetErrors.confirmPassword}
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

            {forgotPassword.error && (
              <Text className="text-red-500 text-sm mt-2 text-center">
                {forgotPassword.error}
              </Text>
            )}

            <CustomButton
              title="Reset Password"
              onPress={onResetPasswordPress}
              className="mt-5 bg-success-500"
              disabled={
                resetForm.code.length !== 6 ||
                !resetForm.password ||
                !resetForm.confirmPassword
              }
            />

            <TouchableOpacity
              onPress={onResendResetCode}
              className="mt-4"
              disabled={resendCooldown > 0}
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
          isVisible={forgotPassword.state === "success"}
          onBackdropPress={() => {}} // Prevent dismissing
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Password Reset!
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              Your password has been successfully reset. Signing you in...
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
