import { Message } from './message.interface';
import { User } from './user.interface';

export interface ChatInfo {
  users: User[];
  messages: Message[];
}
