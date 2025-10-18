import { View, Text, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  const handlePress = () => {
    scale.value = 0.95;
    setTimeout(() => {
      scale.value = 1;
      router.push("/"); // Redirect to home or another route
    }, 100);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Animated.View style={animatedStyle} className="p-6 bg-white rounded-lg shadow-lg">
        <Text className="text-2xl font-bold text-red-500 mb-4">404 - Page Not Found</Text>
        <Text className="text-lg text-gray-700 mb-6">
          Sorry, the page you're looking for doesn't exist.
        </Text>
        <Pressable
          onPress={handlePress}
          className="bg-blue-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Go to Home</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}