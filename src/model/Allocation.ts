// model/Post.js
import { Model } from '@nozbe/watermelondb';
import {
  field,
  readonly,
  date,
  children,
} from '@nozbe/watermelondb/decorators';

export default class Allocation extends Model {
  static table = 'allocations';
  static associations = {
    account_allocations: { type: 'has_many', foreignKey: 'allocation_id' },
  };

  @field('income') income: number;
  @readonly @date('created_at') createdAt: Date;

  @children('account_allocations') accountAllocations;
}
