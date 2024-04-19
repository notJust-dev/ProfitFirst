import { FlatList } from 'react-native';
import AccountListItem from './AccountListItem';

export default function AccountsList() {
  return (
    <FlatList
      data={[1, 2, 3]}
      contentContainerStyle={{ gap: 5 }}
      renderItem={() => <AccountListItem />}
    />
  );
}
