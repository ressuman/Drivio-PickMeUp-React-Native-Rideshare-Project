import { icons, images } from "@/constants";
import { useLocationStore } from "@/store";
import { PaymentProps } from "@/types/type";
import { useStripe } from "@stripe/stripe-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import CustomButton from "./CustomButton";

export default function Payment({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: Readonly<PaymentProps>) {
  const router = useRouter();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  //const { userId } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPublishableKey = async () => {
    // const key = await fetchKey(); // fetch key from your server here
    //setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  // const openPaymentSheet = async () => {
  //   setLoading(true);
  //   try {
  //     await initializePaymentSheet();
  //     const { error } = await presentPaymentSheet();

  //     if (error) {
  //       Alert.alert("Payment Failed", `${error.message}`);
  //     } else {
  //       setSuccess(true);
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  // const initializePaymentSheet = async () => {
  //   const { error } = await initPaymentSheet({
  //     merchantDisplayName: "RideShare App",
  //     intentConfiguration: {
  //       mode: {
  //         amount: parseInt(amount) * 100,
  //         currencyCode: "usd",
  //       },
  //       confirmHandler: async (
  //         paymentMethod,
  //         shouldSavePaymentMethod,
  //         intentCreationCallback,
  //       ) => {
  //         const { paymentIntent, customer } = await fetchAPI(
  //           "/(api)/(stripe)/create",
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               name: fullName || email.split("@")[0],
  //               email: email,
  //               amount: amount,
  //               paymentMethodId: paymentMethod.id,
  //             }),
  //           },
  //         );

  //         if (paymentIntent.client_secret) {
  //           const { result } = await fetchAPI("/(api)/(stripe)/pay", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               payment_method_id: paymentMethod.id,
  //               payment_intent_id: paymentIntent.id,
  //               customer_id: customer,
  //               client_secret: paymentIntent.client_secret,
  //             }),
  //           });

  //           if (result.client_secret) {
  //             await fetchAPI("/(api)/ride/create", {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //               body: JSON.stringify({
  //                 origin_address: userAddress,
  //                 destination_address: destinationAddress,
  //                 origin_latitude: userLatitude,
  //                 origin_longitude: userLongitude,
  //                 destination_latitude: destinationLatitude,
  //                 destination_longitude: destinationLongitude,
  //                 ride_time: rideTime.toFixed(0),
  //                 fare_price: parseInt(amount) * 100,
  //                 payment_status: "paid",
  //                 driver_id: driverId,
  //                 user_id: userId,
  //               }),
  //             });

  //             intentCreationCallback({
  //               clientSecret: result.client_secret,
  //             });
  //           }
  //         }
  //       },
  //     },
  //     returnURL: "myapp://book-ride",
  //   });
  // };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "RideShare App",
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmHandler = async (
    paymentMethod,
    shouldSavePaymentMethod,
    intentCreationCallback,
  ) => {};

  return (
    <>
      <CustomButton
        title={loading ? "Processing..." : "Complete Booking"}
        onPress={openPaymentSheet}
        disabled={loading}
        bgVariant="primary"
        className="bg-primary-500 shadow-lg shadow-primary-500/30"
        IconLeft={() =>
          loading ? (
            <ActivityIndicator size="small" color="white" className="mr-2" />
          ) : (
            <Image
              source={icons.lock}
              className="w-5 h-5 mr-2"
              style={{ tintColor: "white" }}
              resizeMode="contain"
            />
          )
        }
      />

      {/* Security Info */}
      <View className="mt-4 p-3 bg-success-50 rounded-xl border border-success-200">
        <View className="flex-row items-center">
          <View className="w-6 h-6 bg-success-500 rounded-full items-center justify-center mr-2">
            <Text className="text-white text-xs">🔒</Text>
          </View>
          <Text className="text-xs font-JakartaMedium text-success-700 flex-1">
            Your payment information is secure and encrypted
          </Text>
        </View>
      </View>

      {/* Success Modal */}
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.8}
      >
        <View className="flex-1 justify-center items-center p-5">
          <View className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <LinearGradient
              colors={["#F5F8FF", "#EBF4FF"]}
              className="w-24 h-24 rounded-full items-center justify-center mx-auto mb-6"
            >
              <View className="w-16 h-16 bg-success-500 rounded-full items-center justify-center">
                <Image
                  source={images.check}
                  className="w-8 h-8"
                  style={{ tintColor: "white" }}
                />
              </View>
            </LinearGradient>

            <Text className="text-2xl text-center font-JakartaBold text-secondary-900 mb-2">
              Booking Confirmed!
            </Text>

            <Text className="text-base text-center font-JakartaMedium text-secondary-600 mb-6">
              Your ride has been successfully booked. Your driver will arrive at
              the pickup location shortly.
            </Text>

            {/* Ride Details Summary */}
            <View className="bg-general-600 rounded-2xl p-4 mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm font-JakartaSemiBold text-secondary-900">
                  Total Paid
                </Text>
                <Text className="text-lg font-JakartaBold text-success-500">
                  ${amount}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-JakartaSemiBold text-secondary-900">
                  Pickup Time
                </Text>
                <Text className="text-sm font-JakartaMedium text-secondary-600">
                  {rideTime} mins
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              <CustomButton
                title="Track Your Ride"
                onPress={() => {
                  setSuccess(false);
                  router.push("/(root)/(tabs)/rides");
                }}
                bgVariant="primary"
                className="bg-primary-500"
                IconLeft={() => (
                  <Image
                    source={icons.map}
                    className="w-5 h-5 mr-2"
                    style={{ tintColor: "white" }}
                    resizeMode="contain"
                  />
                )}
              />

              <CustomButton
                title="Back to Home"
                onPress={() => {
                  setSuccess(false);
                  router.push("/(root)/(tabs)/home");
                }}
                bgVariant="outline"
                textVariant="primary"
                className="border-primary-500"
              />
            </View>
          </View>
        </View>
      </ReactNativeModal>
    </>
  );
}
