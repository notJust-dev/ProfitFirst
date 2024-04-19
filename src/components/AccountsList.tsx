import { FlatList } from 'react-native';
import AccountListItem from './AccountListItem';
import { accountsCollection } from '../db';
import Account from '../model/Account';

import { withObservables } from '@nozbe/watermelondb/react';

function AccountsList({ accounts }: { accounts: Account[] }) {
  return (
    <FlatList
      data={accounts}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => <AccountListItem account={item} />}
    />
  );
}

const enhance = withObservables([], () => ({
  accounts: accountsCollection.query(),
}));

export default enhance(AccountsList);
