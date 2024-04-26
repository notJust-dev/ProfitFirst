import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import AllocationsList from '../../../components/AllocationsList';
import { Feather } from '@expo/vector-icons';
import { mySync } from '../../../db/sync';
import { supabase } from '../../../lib/supabase';
import * as Crypto from 'expo-crypto';

export default function HomeScreen() {
  const test = async () => {
    const res = await supabase.rpc('create_account', {
      _id: Crypto.randomUUID(),
      _user_id: Crypto.randomUUID(), // Replace 'uuid-string-here' with a valid UUID
      _name: 'Example Name', // Replace 'Example Name' with the actual account name
      _cap: 1000.0, // Set a numeric value for the cap
      _tap: 500.0, // Set a numeric value for the tap
      _created_at: new Date().toISOString(), // Current date-time in ISO string format
      _updated_at: new Date().toISOString(), // Current date-time in ISO string format
    });
    console.log(res);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Allocations',
          headerRight: () => (
            <Feather
              name="refresh-cw"
              size={20}
              color="green"
              onPress={mySync}
            />
          ),
        }}
      />
      <Button title="Test" onPress={test} />

      <Link href="/allocations/new" asChild>
        <Text style={styles.button}>New Allocation</Text>
      </Link>

      <AllocationsList />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: 'green',
    color: 'white',
    margin: 10,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    borderRadius: 5,
    overflow: 'hidden',
  },
});
