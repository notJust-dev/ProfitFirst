import { FlatList } from 'react-native';
import AccountListItem from './AccountListItem';
import { useEffect, useState } from 'react';
import { accountsCollection } from '../db';
import Account from '../model/Account';

export default function AccountsList() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await accountsCollection.query().fetch();
      setAccounts(accounts);
    };
    fetchAccounts();
  }, []);

  return (
    <FlatList
      data={accounts}
      contentContainerStyle={{ gap: 5 }}
      renderItem={({ item }) => <AccountListItem account={item} />}
    />
  );
}
