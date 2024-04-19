// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

export default class Allocation extends Model {
  static table = 'allocations';

  @field('income') income: number;
  @readonly @date('created_at') createdAt;
}
