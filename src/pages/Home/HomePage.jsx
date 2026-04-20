import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Home/Sidebar/Sidebar';
import Icon from '../../components/Icon/Icon';
import { FiMic, FiSend } from 'react-icons/fi';
import './HomePage.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const getChatId = (a, b) => [a.toLowerCase(), b.toLowerCase()].sort().join('_');

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Loading conversations...');
  const recognitionRef = useRef(null);

  const apiPrefix = 'https://monsoon-jqgy.onrender.com/api/messages';

  const sidebarUsers = useMemo(() => {
    if (!user) return [];

    const chatMap = new Map(chatList.map((chat) => [chat.username.toLowerCase(), chat]));

    return users.map((other) => {
      const otherUsername = other.username.toLowerCase();
      const chat = chatMap.get(otherUsername);
      const chatId = chat?.chatId || getChatId(user.username, otherUsername);
      const profileName = other.name || other.username;

      return {
        chatId,
        profileName,
        username: other.username,
        profilePicture: other.profilePicture,
        lastMessage: chat?.lastMessage || 'Tap to start chat',
        unreadCount: chat?.unreadCount || 0,
        lastMessageTime: chat?.lastMessageTime || new Date(0),
      };
    });
  }, [users, chatList, user]);

  const activeConversation = useMemo(() => {
    if (activeChat) return activeChat;
    if (sidebarUsers.length > 0) return sidebarUsers[0];
    return null;
  }, [activeChat, sidebarUsers]);

  useEffect(() => {
    if (!activeChat && sidebarUsers.length > 0) {
      setActiveChat(sidebarUsers[0]);
    }
  }, [sidebarUsers, activeChat]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    loadChats(parsed.username);
    loadUsers(parsed.username);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessageText((prev) => `${prev} ${transcript}`.trim());
        setIsListening(false);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const loadUsers = async (username) => {
    try {
      const response = await fetch(`${apiPrefix}/users/${username}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Unable to load users.', error);
    }
  };

  const loadChats = async (username) => {
    try {
      const response = await fetch(`${apiPrefix}/chats/${username}`);
      const data = await response.json();
      if (data.success) {
        const sorted = data.chats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        setChatList(sorted);
        if (!sorted.length) {
          setStatus('No chat history yet. Start a conversation.');
        } else {
          setStatus('Select a chat to open a conversation.');
        }
      } else {
        setStatus(data.message || 'Failed to load chats.');
      }
    } catch (error) {
      setStatus('Unable to load chats.');
      console.error(error);
    }
  };

  const openChat = async (chat) => {
    setActiveChat(chat);
    if (!user) return;
    try {
      const response = await fetch(`${apiPrefix}/conversation/${chat.chatId}/${user.username}`);
      const data = await response.json();
      if (data.success) {
        setActiveChat({ ...chat, messages: data.messages });
        setChatList((prev) =>
          prev.map((item) => (item.chatId === chat.chatId ? { ...item, unreadCount: 0 } : item))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !user || !activeConversation) return;

    const receiver = activeConversation.username;
    const payload = {
      sender: user.username,
      receiver,
      content: messageText.trim(),
    };

    try {
      const response = await fetch(`${apiPrefix}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setActiveChat((prev) => ({
          ...prev,
          messages: data.messages,
        }));
        setMessageText('');
        loadChats(user.username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      setStatus('Voice input is not supported in this browser.');
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  return (
    <div className="home-shell">
      <Navbar user={user} />
      <div className="home-body">
        <Sidebar chats={sidebarUsers} activeChatId={activeConversation?.chatId} onSelectChat={openChat} />

        <main className="chat-panel">
          <div className="chat-topbar">
            <div>
              <h2>{activeConversation ? activeConversation.profileName : 'No active chat'}</h2>
              <p>{activeConversation ? `Last message: ${activeConversation.lastMessage}` : status}</p>
            </div>
          </div>

          <div className="messages-window">
            {activeConversation ? (
              activeConversation.messages?.length > 0 ? (
                activeConversation.messages.map((message, index) => {
                  const isSelf = message.sender.toLowerCase() === user?.username.toLowerCase();
                  return (
                    <div key={index} className={`message-row ${isSelf ? 'sent' : 'received'}`}>
                      <div className={`message-bubble ${isSelf ? 'bubble-sent' : 'bubble-received'}`}>
                        <p>{message.content}</p>
                        <time>{formatTime(message.timestamp)}</time>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  {activeConversation.chatId
                    ? 'No messages in this conversation yet. Send a message to start chatting.'
                    : 'Select a conversation to view messages.'}
                </div>
              )
            ) : (
              <div className="empty-state">Select a conversation to view messages.</div>
            )}
          </div>

          <div className="chat-input-shell">
            <button
              className={`voice-button ${isListening ? 'recording' : ''}`}
              type="button"
              onClick={startVoiceInput}
              aria-label={isListening ? 'Listening' : 'Start voice input'}
            >
              <Icon component={FiMic} title={isListening ? 'Listening' : 'Voice input'} />
            </button>
            <textarea
              className="message-input"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button className="send-button" type="button" onClick={handleSend} aria-label="Send message">
              <Icon component={FiSend} title="Send message" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
