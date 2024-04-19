import { View, Text, StyleSheet } from 'react-native';
import Account from '../model/Account';
import { withObservables } from '@nozbe/watermelondb/react';

type AccountListItem = {
  account: Account;
};

function AccountListItem({ account }: AccountListItem) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{account.name}</Text>
      <Text style={styles.percentage}>{account.cap}%</Text>
      <Text style={styles.percentage}>{account.tap}%</Text>
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
  },
  percentage: {},
});
