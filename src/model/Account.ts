// model/Post.js
import { Model } from '@nozbe/watermelondb';
import { field, text, nochange, readonly, date } from '@nozbe/watermelondb/decorators';

export default class Account extends Model {
  static table = 'accounts';

  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @text('name') name: string;
  @field('cap') cap: number;
  @field('tap') tap: number;

  @nochange @field('user_id') userId: string;
}
