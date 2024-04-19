import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NewAllocationScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: 'New Allocation' }} />

      <Text>New Allocation</Text>
    </View>
  );
}
