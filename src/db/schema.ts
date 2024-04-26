import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'cap', type: 'number' },
        { name: 'tap', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'allocations',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'income', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'account_allocations',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'account_id', type: 'string' },
        { name: 'allocation_id', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'cap', type: 'number' },
      ],
    }),
  ],
});
