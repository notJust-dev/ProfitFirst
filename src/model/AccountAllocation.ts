// model/Post.js
import { Model } from '@nozbe/watermelondb';
import {
  field,
  text,
  readonly,
  date,
  immutableRelation,
  nochange,
} from '@nozbe/watermelondb/decorators';

export default class AccountAllocation extends Model {
  static table = 'account_allocations';
  static associations = {
    allocations: { type: 'belongs_to', key: 'allocation_id' },
    accounts: { type: 'belongs_to', key: 'account_id' },
  };

  @readonly @date('created_at') createdAt: Date;
  @field('cap') cap: number;
  @field('amount') amount: number;
  @nochange @field('user_id') userId: string;

  @immutableRelation('accounts', 'account_id') account;
  @immutableRelation('allocations', 'allocation_id') allocation;
}
