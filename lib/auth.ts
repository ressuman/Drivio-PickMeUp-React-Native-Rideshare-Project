import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { fetchAPI } from "./fetch";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      console.log(
        item ? `${key} was used 🔐 \n` : `No values stored under key: ${key}`,
      );
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key); // Optional: consider removing this
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`${key} was securely saved ✅`);
    } catch (err) {
      console.error(`Failed to save ${key} in SecureStore: `, err);
    }
  },
};

// Calculate password strength
export const calculatePasswordStrength = (password) => {
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

// Validate sign up form data
export const validateSignUpForm = (form) => {
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

  return {
    errors: newErrors,
    isValid: Object.values(newErrors).every((error) => !error),
  };
};

// Sign in validation
export const validateSignInForm = (form) => {
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
  return {
    errors: newErrors,
    isValid: Object.values(newErrors).every((error) => !error),
  };
};

// Handle sign up process
export const handleSignUp = async (
  form,
  signUp,
  setVerification,
  verification,
) => {
  try {
    // Start sign-up process using email and password provided
    await signUp.create({
      emailAddress: form.email,
      password: form.password,
    });

    // Send user an email with verification code
    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });

    // Set 'pendingVerification' to true to display second form
    // and capture OTP code
    setVerification({ ...verification, state: "pending" });
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    Alert.alert(
      "Something went wrong. Please try again.",
      err.errors[0].longMessage,
    );
  }
};

// Handle sign in process
export const handleSignIn = async (
  form,
  signIn,
  setActive,
  router,
  setErrors,
  errors,
) => {
  try {
    const signInAttempt = await signIn.create({
      identifier: form.email,
      password: form.password,
    });

    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });
      router.replace("/(root)/(tabs)/home");
    } else {
      console.error(JSON.stringify(signInAttempt, null, 2));
      setErrors({
        ...errors,
        password: "Sign in failed. Please check your credentials.",
      });
    }
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    setErrors({
      ...errors,
      email:
        err.errors?.[0]?.message ||
        "Invalid email or password. Please try again.",
    });
  }
};

// Handle verification process
export const handleVerification = async (
  signUp,
  setActive,
  router,
  verification,
  setVerification,
  form,
) => {
  try {
    // Use the code the user provided to attempt verification
    const signUpAttempt = await signUp.attemptEmailAddressVerification({
      code: verification.code,
    });

    // If verification was completed, set the session to active
    // and redirect the user
    if (signUpAttempt.status === "complete") {
      // 1️⃣ Save user to backend
      await fetchAPI("/(api)/user", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          clerkId: signUpAttempt.createdUserId,
        }),
      });

      // 2️⃣ Set session
      await setActive({ session: signUpAttempt.createdSessionId });

      // Show success modal first, then navigate after a delay
      setVerification({ ...verification, state: "success" });

      // Navigate after showing success modal for 2 seconds
      setTimeout(() => {
        router.replace("/(root)/(tabs)/home");
      }, 2000);
    } else {
      // If the status is not complete, check why. User may need to
      // complete further steps.
      console.error(JSON.stringify(signUpAttempt, null, 2));
      setVerification({
        ...verification,
        error: "Verification failed. Please try again.",
      });
    }
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    setVerification({
      ...verification,
      error:
        err.errors?.[0]?.message ||
        "Invalid verification code. Please try again.",
    });
  }
};

// Handle resend verification code
export const handleResendCode = async (
  signUp,
  setVerification,
  verification,
  setResendCooldown,
) => {
  try {
    // Start cooldown timer (60 seconds)
    setResendCooldown(60);

    // Resend verification code
    await signUp.prepareEmailAddressVerification({
      strategy: "email_code",
    });

    // Clear any existing errors
    setVerification({
      ...verification,
      error: "",
      code: "",
    });

    Alert.alert(
      "Code Resent",
      "A new verification code has been sent to your email.",
    );

    // Start countdown
    const countdown = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    setResendCooldown(0);
    Alert.alert(
      "Resend Failed",
      err.errors?.[0]?.message ||
        "Failed to resend verification code. Please try again.",
    );
  }
};

// Validate email for forgot password
export const validateForgotPasswordForm = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return {
      error: "Please enter your email address",
      isValid: false,
    };
  }

  if (!emailRegex.test(email)) {
    return {
      error: "Please enter a valid email address",
      isValid: false,
    };
  }

  return {
    error: "",
    isValid: true,
  };
};

// Validate reset password form
export const validateResetPasswordForm = (form) => {
  let newErrors = {
    code: "",
    password: "",
    confirmPassword: "",
  };

  // Code validation
  if (!form.code.trim()) {
    newErrors.code = "Please enter the verification code";
  } else if (form.code.length !== 6) {
    newErrors.code = "Please enter the complete 6-digit code";
  }

  // Password validation
  if (!form.password) {
    newErrors.password = "Please enter your new password";
  } else if (form.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    newErrors.password = "Include uppercase, lowercase, and a number";
  }

  // Confirm password validation
  if (!form.confirmPassword) {
    newErrors.confirmPassword = "Please confirm your new password";
  } else if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = "Passwords don't match";
  }

  return {
    errors: newErrors,
    isValid: Object.values(newErrors).every((error) => !error),
  };
};

// Handle forgot password request
export const handleForgotPassword = async (
  email,
  signIn,
  setForgotPassword,
  forgotPassword,
) => {
  try {
    // Start the password reset process
    await signIn.create({
      strategy: "reset_password_email_code",
      identifier: email,
    });

    // Update state to show reset form
    setForgotPassword({
      ...forgotPassword,
      state: "reset",
      email: email,
      error: "",
    });
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    setForgotPassword({
      ...forgotPassword,
      error:
        err.errors?.[0]?.longMessage ||
        "Failed to send reset code. Please try again.",
    });
  }
};

// Handle password reset
export const handlePasswordReset = async (
  form,
  signIn,
  setActive,
  router,
  setForgotPassword,
  forgotPassword,
) => {
  try {
    // Attempt to reset password with the code and new password
    const resetAttempt = await signIn.attemptFirstFactor({
      strategy: "reset_password_email_code",
      code: form.code,
      password: form.password,
    });

    if (resetAttempt.status === "complete") {
      // Set the active session and show success
      await setActive({ session: resetAttempt.createdSessionId });

      setForgotPassword({
        ...forgotPassword,
        state: "success",
        error: "",
      });

      // Navigate to home after showing success
      setTimeout(() => {
        router.replace("/(root)/(tabs)/home");
      }, 2000);
    } else if (resetAttempt.status === "needs_second_factor") {
      // Handle 2FA if required (you can implement this later)
      setForgotPassword({
        ...forgotPassword,
        error:
          "Two-factor authentication is required but not implemented in this flow.",
      });
    } else {
      console.error(JSON.stringify(resetAttempt, null, 2));
      setForgotPassword({
        ...forgotPassword,
        error: "Password reset failed. Please try again.",
      });
    }
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    setForgotPassword({
      ...forgotPassword,
      error:
        err.errors?.[0]?.longMessage ||
        "Invalid code or password. Please try again.",
    });
  }
};

// Handle resend reset code
export const handleResendResetCode = async (
  email,
  signIn,
  setForgotPassword,
  forgotPassword,
  setResendCooldown,
) => {
  try {
    // Start cooldown timer (60 seconds)
    setResendCooldown(60);

    // Resend the reset code
    await signIn.create({
      strategy: "reset_password_email_code",
      identifier: email,
    });

    // Clear any existing errors
    setForgotPassword({
      ...forgotPassword,
      error: "",
    });

    Alert.alert(
      "Code Resent",
      "A new password reset code has been sent to your email.",
    );

    // Start countdown
    const countdown = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  } catch (err) {
    console.error(JSON.stringify(err, null, 2));
    setResendCooldown(0);
    Alert.alert(
      "Resend Failed",
      err.errors?.[0]?.longMessage ||
        "Failed to resend reset code. Please try again.",
    );
  }
};

// export const googleOAuth = async (startOAuthFlow: any) => {
//   try {
//     const { createdSessionId, setActive, signUp } = await startOAuthFlow({
//       redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
//     });

//     if (createdSessionId && setActive) {
//       await setActive({ session: createdSessionId });

//       if (signUp?.createdUserId) {
//         await fetchAPI("/(api)/user", {
//           method: "POST",
//           body: JSON.stringify({
//             name: `${signUp.firstName ?? ""} ${signUp.lastName ?? ""}`.trim(),
//             email: signUp.emailAddress,
//             clerkId: signUp.createdUserId,
//           }),
//         });
//       }

//       return {
//         success: true,
//         code: "success",
//         message: "You have successfully signed in with Google",
//       };
//     }

//     return {
//       success: false,
//       code: "no_session",
//       message: "An error occurred while signing in with Google",
//     };
//   } catch (err: any) {
//     console.error("Google OAuth Error:", err);

//     return {
//       success: false,
//       code: err?.code ?? "unknown_error",
//       message:
//         err?.errors?.[0]?.longMessage ??
//         "Something went wrong during Google Sign-In",
//     };
//   }
// };
