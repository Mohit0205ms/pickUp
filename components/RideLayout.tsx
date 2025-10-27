import { icons } from '@/constants';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Map from './Map';

const RideLayout = ({
  title,
  children,
  snapPoints,
}: {
  title: string;
  children: React.ReactNode;
  snapPoints?: string[];
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  return (
    <GestureHandlerRootView>
      <View className='flex-1 bg-white'>
        <View className='flex flex-col h-screen bg-blue-500'>
          <View className='flex flex-row absolute z-10 top-16 items-center justify-start px-5'>
            <TouchableOpacity onPress={() => router.back()}>
              <View className='w-10 h-10 bg-white rounded-full items-center justify-center'>
                <Image
                  source={icons.backArrow}
                  resizeMode='contain'
                  className='w-6 h-6'
                />
              </View>
            </TouchableOpacity>
            <Text className='text-xl font-JakartaSemiBold ml-5'>
              {title || 'Go Back'}
            </Text>
          </View>
          <Map />
        </View>
      </View>
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
        snapPoints={snapPoints || ['85%']}
        index={0}
        bottomInset={insets.bottom}
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }} >
          {children}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
