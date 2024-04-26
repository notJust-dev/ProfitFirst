import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'cap', type: 'number' },
        { name: 'tap', type: 'number' },
        { name: 'user_id', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'allocations',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'income', type: 'number' },
        { name: 'user_id', type: 'string' },
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
        { name: 'user_id', type: 'string' },
      ],
    }),
  ],
});
