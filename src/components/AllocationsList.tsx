import { FlatList } from 'react-native';
import AllocationListItem from './AllocationListItem';
import { withObservables } from '@nozbe/watermelondb/react';
import { allocationsCollection } from '../db';
import Allocation from '../model/Allocation';
import { Q } from '@nozbe/watermelondb';

function AllocationsList({ allocations }: { allocations: Allocation[] }) {
  return (
    <FlatList
      data={allocations}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <AllocationListItem allocation={item} />}
    />
  );
}

const enhance = withObservables([], () => ({
  allocations: allocationsCollection.query(Q.sortBy('created_at', Q.desc)),
}));

export default enhance(AllocationsList);
