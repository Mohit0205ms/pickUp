import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';
import { useAuth } from '@clerk/clerk-expo';

export default function Layout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='welcome' />
      <Stack.Screen name='sign-up' />
      <Stack.Screen name='sign-in' />
    </Stack>
  );
}
