import useGetMessages from '../../hooks/useGetMessages';
import Message from './Message';
import MessageSkeleton from '../skeleton/MessageSkeleton';
import { useEffect, useRef } from 'react';
import useListenMessages from '../../hooks/useListenMessages';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const lastMessageRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behaviour: 'smooth' });
    }, 100);
  }, [messages]);
  //  This below hook will listen for incoming messages from socket
  useListenMessages();
  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => {
          return (
            <div key={message._id} ref={lastMessageRef}>
              <Message message={message} />
            </div>
          );
        })}

      {loading &&
        [...Array(3)].map((_, idx) => {
          return <MessageSkeleton key={idx} />;
        })}

      {!loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      )}
    </div>
  );
};
export default Messages;
