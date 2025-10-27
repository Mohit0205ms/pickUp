import RideCard from '@/components/rideCard';
import { images } from '@/constants';
import { useFetch } from '@/lib/fetch';
import { useUser } from '@clerk/clerk-expo';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Rides = () => {
  const { user } = useUser();
  const { data: recentRides, loading } = useFetch(`/(api)/ride/${user?.id}`);
  return (
    <SafeAreaView>
      <FlatList
        data={
          recentRides && Array.isArray(recentRides)
            ? recentRides
            : []
        }
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.ride_id}
        className='px-5'
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className='flex flex-col items-center justify-center h-full'>
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className='w-40 h-40'
                  alt='No recent rides found'
                  resizeMode='contain'
                />
                <Text className='text-sm'>No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size={'large'} color={'black'} />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <Text className="text-2xl font-JakartaBold my-5" >All Rides</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;
