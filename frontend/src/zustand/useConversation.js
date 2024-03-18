import { create } from 'zustand';

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;

//here selectedConversation and setSelectedConversation are same as doing: const [selectedConversation, setSelectedConversation] = useState(null)
//here messages and setMessages are same as doing: const [messages, setMessages] = useState([])
