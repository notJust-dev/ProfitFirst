import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import database, { accountsCollection, allocationsCollection } from '../../db';
import { withObservables } from '@nozbe/watermelondb/react';
import Account from '../../model/Account';

function NewAllocationScreen({ accounts }: { accounts: Account[] }) {
  const [income, setIncome] = useState('0');

  const save = async () => {
    await database.write(async () => {
      allocationsCollection.create((newAllocation) => {
        newAllocation.income = Number.parseFloat(income);
      });
    });
    setIncome('');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'New Allocation' }} />

      <View style={styles.inputRow}>
        <Text style={styles.label}>Income</Text>
        <TextInput
          value={income}
          onChangeText={setIncome}
          placeholder="$123"
          style={styles.input}
        />
      </View>

      {accounts.map((account) => (
        <View key={account.id} style={styles.inputRow}>
          <Text style={{ flex: 1 }}>
            {account.name}: {account.cap}%
          </Text>
          <Text>${(Number.parseFloat(income) * account.cap) / 100}</Text>
        </View>
      ))}

      <Button title="Save" onPress={save} />
    </View>
  );
}

const enhance = withObservables([], () => ({
  accounts: accountsCollection.query(),
}));

export default enhance(NewAllocationScreen);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
});
