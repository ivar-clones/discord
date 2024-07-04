import { User } from '@/core/models/user.interface';

export interface AppState {
  chatList: User[];
  currentUser: User;
}

export type Action =
  | { type: 'ADD_CHAT'; payload: User }
  | { type: 'SET_CHAT_LIST'; payload: User[] }
  | { type: 'CLEAR_STATE' }
  | { type: 'SET_CURRENT_USER'; payload: User };

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_CHAT':
      return { ...state, chatList: [action.payload, ...state.chatList] };
    case 'SET_CHAT_LIST':
      return { ...state, chatList: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'CLEAR_STATE':
      return {
        chatList: [],
        currentUser: { id: '', username: '' }
      };
    default:
      return state;
  }
}
