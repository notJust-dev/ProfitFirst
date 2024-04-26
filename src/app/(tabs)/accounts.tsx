import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import AccountsList from '../../components/AccountsList';
import { useState } from 'react';
import database, { accountsCollection } from '../../db';

export default function AccountsScreen() {
  const [name, setName] = useState('');
  const [cap, setCap] = useState('');
  const [tap, setTap] = useState('');

  const createAccount = async () => {
    await database.write(async () => {
      await accountsCollection.create((account) => {
        account.name = name;
        account.cap = Number.parseFloat(cap);
        account.tap = Number.parseFloat(tap);
      });
    });
    setName('');
    setCap('');
    setTap('');
  };

  return (
    <View style={{ gap: 5, padding: 5 }}>
      <View style={styles.header}>
        <Text>Name</Text>
        <Text>CAP</Text>
        <Text>TAP</Text>
      </View>

      <AccountsList />

      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          style={styles.input}
        />
        <TextInput
          value={cap}
          onChangeText={setCap}
          placeholder="CAP %"
          style={styles.input}
        />
        <TextInput
          value={tap}
          onChangeText={setTap}
          placeholder="TAP %"
          style={styles.input}
        />
      </View>

      <Button title="Add account" onPress={createAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
  },
});
