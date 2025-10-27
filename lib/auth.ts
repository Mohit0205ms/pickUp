import * as Linking from 'expo-linking';
import { fetchAPI } from './fetch';

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, signUp, setActive } = await startOAuthFlow({
      strategy: 'oauth_google',
      redirectUrl: Linking.createURL('/(root)/(tabs)/home'),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });
        if (signUp.createdUserId) {
          await fetchAPI('/(api)/user', {
            method: 'POST',
            body: JSON.stringify({
              name: `${signUp.firstNmae} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }
        return {
          success: true,
          code: 'success',
          message: 'You have successfully authenticated',
        };
      }
    }
    return {
      success: false,
      message: 'An error occurred',
    };
  } catch (error: any) {
    __DEV__ && console.log(error);

    return {
      success: false,
      message: error?.errors[0]?.longMessage,
    };
  }
};
