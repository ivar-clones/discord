export interface Message {
  id?: number;
  timestamp?: string;
  sender: string;
  recipient: string;
  content: string;
}
