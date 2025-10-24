import { icons } from '@/constants';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

// Helper to debounce a value
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

type Prediction = { description: string; place_id: string };

interface Props {
  apiKey: string;
  onPlaceSelected: (data: any, details: any) => void;
  placeholder?: string;
}

export default function PlacesAutocomplete({
  apiKey,
  onPlaceSelected,
  placeholder = 'Search address…',
}: Props) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const sessionToken = useRef(Math.random().toString(36).substr(2, 10));

  useEffect(() => {
    async function fetchPredictions() {
      if (!debouncedInput.trim()) {
        setPredictions([]);
        return;
      }
      const qs = new URLSearchParams({
        input: debouncedInput,
        key: apiKey,
        sessiontoken: sessionToken.current,
        types: 'address',
        language: 'en',
      }).toString();

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?${qs}`,
        );
        const json = await res.json();
        if (json.status === 'OK') {
          setPredictions(json.predictions);
        } else {
          console.warn(
            'Places Autocomplete error',
            json.status,
            json.error_message,
          );
          setPredictions([]);
        }
      } catch (err) {
        console.error('Network error fetching places', err);
      }
    }
    fetchPredictions();
  }, [debouncedInput, apiKey]);

  const handleSelect = async (pred: Prediction) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${pred.place_id}&fields=geometry&key=${apiKey}&sessiontoken=${sessionToken.current}`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.result.geometry.location;
        console.log("result of location: ", pred, data);
        setInput(pred.description);
        setPredictions([]);
        onPlaceSelected(pred, data.result);
      } else {
        console.warn('Failed to fetch place details', data.status, data.error_message);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <View style={styles.container} className='rounded-2xl' pointerEvents='box-none'>
      <View className='flex flex-row w-full items-center rounded-2xl'>
        <View className='justify-center items-center w-6 h-6 p-6 rounded-2xl'>
          <Image
            source={icons.search}
            className='w-6 h-6'
            resizeMode='contain'
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={input}
          onChangeText={setInput}
          className='rounded-2xl'
        />
      </View>
      {predictions.length > 0 && (
        <ScrollView style={styles.dropdown}>
          {predictions.map((p) => (
            <TouchableOpacity
              key={p.place_id}
              style={styles.item}
              onPress={() => handleSelect(p)}
            >
              <Text>{p.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 16,
  },
  input: {
    height: 44,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 15,
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  dropdown: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRadius: 4,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
