import './Sidebar.css';

export default function Sidebar({ chats, activeChatId, onSelectChat }) {
  return (
    <aside className="sidebar-shell">
      <div className="sidebar-header">
        <div className="sidebar-title">Chats</div>
        <div className="sidebar-status">Active conversations</div>
      </div>

      <div className="sidebar-list">
        {chats.map((chat) => (
          <button
            key={chat.chatId}
            className={`sidebar-item ${chat.chatId === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chat)}
            type="button"
          >
            <img className="sidebar-avatar" src={chat.profilePicture} alt={chat.profileName} />
            <div className="sidebar-details">
              <div className="sidebar-name">{chat.profileName}</div>
              <div className="sidebar-preview">{chat.lastMessage}</div>
            </div>
            {chat.unreadCount > 0 && <span className="sidebar-badge">{chat.unreadCount}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
