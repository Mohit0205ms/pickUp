import { images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { useLocationStore } from '@/store';
import { PaymentProps } from '@/types/type';
import { useAuth } from '@clerk/clerk-expo';
import { useStripe } from '@stripe/stripe-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import CustomButton from './customButton';

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [publishableKey, setPublishableKey] = useState('');
  const [success, setSuccess] = useState(false);

  const { userId } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    destinationAddress,
  } = useLocationStore();

  const fetchPaymentSheetParams = async () => {
    const response = await fetchAPI('/(api)/(stripe)/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName || email.split('@')[0],
        email: email,
        amount: amount,
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = response;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'PickUp, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent.client_secret,
      allowsDelayedPaymentMethods: true,
    });
    if (!error) {
      console.log("Payment sheet initialized successfully");
    }
    console.log("Error initializing payment sheet: ", error);
  };

  const createRide = async () => {
    const rideResponse = await fetchAPI('/(api)/ride/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin_address: userAddress,
        destination_address: destinationAddress,
        origin_latitude: userLatitude,
        origin_longitude: userLongitude,
        destination_latitude: destinationLatitude,
        destination_longitude: destinationLongitude,
        ride_time: parseInt(rideTime.toFixed(2)),
        fare_price: parseInt(amount) * 100,
        payment_status: 'paid',
        driver_id: driverId,
        user_id: userId,
      }),
    });
    if (rideResponse.error) {
      console.error('Ride creation failed:', rideResponse.error);
    }
  };

  const openPaymentSheet = async () => {
    console.log('openPaymentSheet function is called');
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      await createRide();
      setSuccess(true);
    }
  };

  return (
    <>
      <CustomButton
        title='Confirm Ride'
        classes='my-10'
        onPress={openPaymentSheet}
      />
      <ReactNativeModal
        isVisible={success}
        onBackdropPress={() => setSuccess(false)}
      >
        <View className='flex flex-col items-center justify-center bg-white p-7 rounded-2xl'>
          <Image source={images.check} className='w-28 h-28 mt-5 ' />
          <Text className='text-2xl text-center font-JakartaBold mt-5'>
            Ride Booked!
          </Text>
          <Text className='text-empty text-general-200 font-JakartaMedium text-center mt-3'>
            Thank you for your booking. Your reservation has been pplaced.
            Please proceed with your trip!
          </Text>

          <CustomButton
            title='Back Home'
            onPress={() => {
              setSuccess(false);
              router.push('/(root)/(tabs)/home');
            }}
            classes='mt-5'
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default Payment;
