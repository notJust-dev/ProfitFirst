import { View, Text, StyleSheet } from 'react-native';
import Account from '../model/Account';
import { withObservables } from '@nozbe/watermelondb/react';
import { AntDesign } from '@expo/vector-icons';
import database from '../db';

type AccountListItem = {
  account: Account;
};

function AccountListItem({ account }: AccountListItem) {
  const onDelete = async () => {
    await database.write(async () => {
      await account.markAsDeleted();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{account.name}</Text>
      <Text style={styles.percentage}>{account.cap}%</Text>
      <Text style={styles.percentage}>{account.tap}%</Text>
      <AntDesign name="delete" size={18} color="gray" onPress={onDelete} />
    </View>
  );
}

const enhance = withObservables(
  ['account'],
  ({ account }: AccountListItem) => ({
    account,
  })
);

export default enhance(AccountListItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  percentage: {
    flex: 1,
  },
});
