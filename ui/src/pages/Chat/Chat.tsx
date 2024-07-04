import Loader from '@/components/local/Loader/Loader';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/core/models/message.interface';
import { useChatInfo } from '@/core/service/chat/use-get-chat-info';
import { useIsLoggedIn } from '@/hooks/use-is-logged-in';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import moment from 'moment';
import { useAppState } from '@/store/provider';

export default function Chat() {
  useIsLoggedIn();
  const params = useParams();
  const {
    state: { currentUser },
    dispatch
  } = useAppState();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate: getChatInfo, data: chatInfo, status } = useChatInfo();

  const { readyState, lastJsonMessage, sendJsonMessage } = useWebSocket(
    `${import.meta.env.VITE_SERVICE_WS_URL}/ws/${currentUser.id}`,
    {
      share: true,
      shouldReconnect: () => true,
      retryOnError: true
    }
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      console.log('opened');
    }
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage) {
      const parsedJson: Message = JSON.parse(JSON.stringify(lastJsonMessage));
      if (parsedJson.sender === params?.userId) {
        setMessages((prev) => [parsedJson, ...prev]);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (currentUser && currentUser.id && params && params.userId) {
      getChatInfo({ users: [currentUser.id, params.userId] });
    }
  }, [currentUser, currentUser?.id, params, params?.userId]);

  useEffect(() => {
    textareaRef.current!.style!.height = '0px';
    const scrollHeight = textareaRef?.current?.scrollHeight;
    textareaRef.current!.style.height = scrollHeight + 'px';
  }, [currentValue]);

  const handleSendMessage = () => {
    if (currentValue && chatInfo) {
      const sender = currentUser?.id;
      const recipient = params?.userId;
      const recipientUsername = chatInfo.data.users.find((user) => user.id === recipient)?.username;
      if (sender && recipient) {
        const jsonMsg: Message = {
          sender: sender,
          recipient: recipient,
          content: currentValue,
          timestamp: new Date().toISOString()
        };
        sendJsonMessage(jsonMsg);
        if (messages.length === 0) {
          dispatch({
            type: 'ADD_CHAT',
            payload: { id: recipient, username: recipientUsername ?? recipient }
          });
        }
        setMessages((prev) => [jsonMsg, ...prev]);
        setCurrentValue('');
      }
    }
  };

  useEffect(() => {
    if (chatInfo) {
      setMessages(chatInfo.data.messages);
    }
  }, [chatInfo]);

  const getCurrentChatUsername = () => {
    return chatInfo?.data.users.find((user) => user.id === params?.userId)?.username;
  };

  const getMessageTimestamp = (timestamp?: string) => {
    if (!timestamp) {
      return '';
    }

    return moment(timestamp).format('h:mm A');
  };

  const getBorder = (currentMessage: Message, prevMessage: Message) => {
    if (prevMessage.sender === currentMessage.sender) {
      if (currentMessage.sender === currentUser.id) {
        return 'rounded-tr-none';
      }

      return 'rounded-tl-none';
    }
    return '';
  };

  return (
    <React.Fragment>
      {status === 'pending' ? (
        <Loader />
      ) : (
        <React.Fragment>
          <div className='flex flex-row px-7 py-4 font-semibold items-center shadow-topbar z-50'>
            <div className='flex flex-row items-center gap-2'>
              <Avatar className='h-6 w-6'>
                <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
              </Avatar>
              <div className='flex flex-col'>
                <div>{getCurrentChatUsername()}</div>
              </div>
            </div>
          </div>
          <div className='flex flex-grow overflow-y-auto px-7 py-4 flex-col-reverse gap-2'>
            {messages.map((message, i) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === currentUser.id ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`flex ${message.sender === currentUser.id ? 'flex-row-reverse' : 'flex-row'} gap-2`}
                >
                  {i === messages.length - 1 ||
                  (i < messages.length - 1 && getBorder(message, messages[i + 1]) === '') ? (
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src='https://utfs.io/f/b798a2bc-3424-463c-af28-81509ed61caa-o1drm6.png' />
                    </Avatar>
                  ) : (
                    <div className='min-h-8 min-w-8'></div>
                  )}
                  <div
                    className={`flex flex-row gap-2 items-end rounded-lg bg-primary-foreground p-2 ${i < messages.length - 1 && getBorder(message, messages[i + 1])}`}
                  >
                    <div className='flex justify-end'>{message.content}</div>
                    <div className='flex text-muted-foreground text-xs justify-end text-nowrap'>
                      {getMessageTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-stretch flex-col p-7'>
            <textarea
              ref={textareaRef}
              className='rounded-md bg-primary-foreground p-3 pl-5 resize-none overflow-hidden h-12 max-h-[500px] overflow-y-auto'
              placeholder='Message'
              onChange={(e) => setCurrentValue(e.target.value)}
              value={currentValue}
              onKeyDown={(e) => {
                const keyCode = e.key;
                if (keyCode === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
