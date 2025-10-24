import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

const Home = () => {
  const { isSignedIn, isLoaded } = useAuth();
  console.log("isSignedIn: ",isSignedIn, "isLoaded:", isLoaded);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href={'/(root)/(tabs)/home'} />;
  }
  return <Redirect href={'/(auth)/welcome'} />;
};

export default Home;
