import { User } from './user.interface';

export interface FriendRequest {
  id: number;
  userA: User;
  userB: User;
  status: number;
}
