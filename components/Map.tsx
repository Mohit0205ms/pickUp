import { icons } from '@/constants';
import { useFetch } from '@/lib/fetch';
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from '@/lib/map';
import { useDriverStore, useLocationStore } from '@/store';
import { Driver, MarkerData } from '@/types/type';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import MapViewDirection from 'react-native-maps-directions';

const Map = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const { data: drivers, loading, error } = useFetch<Driver[]>('/ride/driver');
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });
  const { selectedDriver, setDrivers } = useDriverStore();

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      console.log('newMarkers: ', newMarkers);
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className='flex justify-between items-center w-full'>
        <ActivityIndicator size={'small'} color={'#000'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex justify-between items-center w-full'>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      userInterfaceStyle={"light"}
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitude: 32.19592744876891,
        longitude: 75.46520351536432,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      tintColor='black'
      mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
      showsPointsOfInterest // not supported on Android
      showsUserLocation={true}
    >
      {markers?.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id
              ? icons.selectedMarker || icons.marker
              : icons.marker
          }
        />
      ))}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key={'destination'}
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title='Destination'
            image={icons.pin}
          />
          <MapViewDirection
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude!,
              longitude: destinationLongitude!,
            }}
            apikey={`${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`}
            strokeColor='#0286ff'
            strokeWidth={4}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
