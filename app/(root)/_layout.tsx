import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';
import { useAuth } from '@clerk/clerk-expo';

export default function Layout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' />
      <Stack.Screen name="find-ride" />
      <Stack.Screen name="confirm-ride" />
      <Stack.Screen name="book-ride" />
    </Stack>
  );
}
