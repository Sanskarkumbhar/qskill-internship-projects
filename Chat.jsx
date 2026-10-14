 
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MessageCircle,
  Search,
  Users,
  Send,
  ArrowLeft,
} from "lucide-react";
import { createSocket } from "../utils/socket";

const API_URL = "http://localhost:5002/api";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedIdRef = useRef(null);
  const userIdRef = useRef(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("chatToken");

  // Load the logged-in user, people, and conversations.
  useEffect(() => {
    const token = getToken();
    const savedUser = localStorage.getItem("chatUser");

    if (!token || !savedUser) {
      navigate("/login");
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
      setUser(currentUser);
      userIdRef.current = String(currentUser._id || currentUser.id);
    } catch {
      localStorage.removeItem("chatUser");
      localStorage.removeItem("chatToken");
      navigate("/login");
      return;
    }

    let cancelled = false;
    const socket = createSocket(token);
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.connect();

    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load users.");
        }

        if (!cancelled) setUsers(data.users || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };

    const loadConversations = async () => {
      try {
        const response = await fetch(`${API_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load conversations."
          );
        }

        if (cancelled) return;

        const loadedConversations = data.conversations || [];
        setConversations(loadedConversations);

        // Join existing conversation rooms to receive messages
        // even when another conversation is currently open.
        loadedConversations.forEach((conversation) => {
          socket.emit("joinConversation", conversation._id, (result) => {
            if (result && !result.success) {
              console.warn(
                "Could not join conversation:",
                result.message
              );
            }
          });
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    };

    // Handle incoming messages from any joined conversation.
    const handleNewMessage = (message) => {
      const incomingId =
        message.conversation?._id || message.conversation;

      if (!incomingId) return;

      const senderId = String(
        message.sender?._id || message.sender || ""
      );

      const isMine = senderId === userIdRef.current;
      const isCurrentlyOpen =
        String(incomingId) === String(selectedIdRef.current);

      setConversations((previous) =>
        previous.map((conversation) => {
          if (String(conversation._id) !== String(incomingId)) {
            return conversation;
          }

          const nextUnreadCount =
            !isMine && !isCurrentlyOpen
              ? (conversation.unreadCount || 0) + 1
              : isCurrentlyOpen
                ? 0
                : conversation.unreadCount || 0;

          return {
            ...conversation,
            lastMessage: message.text || "",
            lastMessageAt:
              message.createdAt || new Date().toISOString(),
            unreadCount: nextUnreadCount,
          };
        })
      );

      // Only append messages to the currently open conversation.
      if (isCurrentlyOpen) {
        setMessages((previous) => {
          const exists = previous.some(
            (item) => String(item._id) === String(message._id)
          );

          return exists ? previous : [...previous, message];
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    loadUsers();
    loadConversations();

    return () => {
      cancelled = true;
      socket.off("newMessage", handleNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [navigate]);

  // Scroll to the newest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateConversationPreview = (conversation, message) => {
    if (!conversation?._id) return;

    setConversations((previous) => {
      const existing = previous.find(
        (item) => String(item._id) === String(conversation._id)
      );

      const updated = {
        ...(existing || {}),
        ...conversation,
        lastMessage: message?.text ?? conversation.lastMessage ?? "",
        lastMessageAt:
          message?.createdAt ??
          conversation.lastMessageAt ??
          new Date().toISOString(),
      };

      return [
        updated,
        ...previous.filter(
          (item) => String(item._id) !== String(conversation._id)
        ),
      ];
    });
  };

  // Open a conversation and mark its messages as read.
  const openConversation = async (person) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setError("");
    setLoadingMessages(true);
    setMessages([]);
    setMessageText("");

    try {
      const response = await fetch(`${API_URL}/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: person._id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not open conversation.");
      }

      const conversation = data.conversation;

      selectedIdRef.current = String(conversation._id);
      setSelectedConversation({
        ...conversation,
        unreadCount: 0,
      });

      // Clear the badge immediately in the sidebar.
      setConversations((previous) => {
        const exists = previous.some(
          (item) => String(item._id) === String(conversation._id)
        );

        if (exists) {
          return previous.map((item) =>
            String(item._id) === String(conversation._id)
              ? { ...item, ...conversation, unreadCount: 0 }
              : item
          );
        }

        return [{ ...conversation, unreadCount: 0 }, ...previous];
      });

      const historyResponse = await fetch(
        `${API_URL}/messages/${conversation._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const historyData = await historyResponse.json();

      if (!historyResponse.ok || !historyData.success) {
        throw new Error(
          historyData.message || "Could not load messages."
        );
      }

      if (selectedIdRef.current === String(conversation._id)) {
        setMessages(historyData.messages || []);
      }

      // The backend GET messages endpoint resets this user's unread count.
      setConversations((previous) =>
        previous.map((item) =>
          String(item._id) === String(conversation._id)
            ? { ...item, unreadCount: 0 }
            : item
        )
      );

      const socket = socketRef.current;

      if (socket?.connected) {
        socket.emit("joinConversation", conversation._id, (result) => {
          if (result && !result.success) {
            setError(
              result.message || "Could not join this conversation."
            );
          }
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send a message through the REST API.
  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageText.trim();
    const conversation = selectedConversation;
    const conversationId = conversation?._id;
    const token = getToken();

    if (!text || !conversationId || sending || !token) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId, text }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Message could not be sent.");
      }

      const sentMessage = data.message;

      setMessages((previous) => {
        const exists = previous.some(
          (item) => String(item._id) === String(sentMessage._id)
        );

        return exists ? previous : [...previous, sentMessage];
      });

      updateConversationPreview(conversation, sentMessage);
      setMessageText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const logout = () => {
    socketRef.current?.disconnect();
    localStorage.removeItem("chatToken");
    localStorage.removeItem("chatUser");
    navigate("/login");
  };

  const filteredUsers = users.filter((person) => {
    const query = search.toLowerCase();

    return (
      person.name?.toLowerCase().includes(query) ||
      person.email?.toLowerCase().includes(query)
    );
  });

  const getConversationForPerson = (person) =>
    conversations.find((conversation) =>
      conversation.participants?.some(
        (participant) =>
          String(participant?._id || participant) === String(person._id)
      )
    );

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    const now = new Date();
    const isToday = parsedDate.toDateString() === now.toDateString();

    if (isToday) {
      return parsedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return parsedDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  const otherParticipant = selectedConversation?.participants?.find(
    (participant) =>
      String(participant?._id || participant) !==
      String(user?._id || user?.id)
  );

  const conversationName = otherParticipant?.name || "Conversation";

  return (
    <main className="chat-page">
      <aside
        className={`chat-sidebar ${
          selectedConversation ? "mobile-hidden" : ""
        }`}
      >
        <header className="sidebar-header">
          <div className="brand">
            <MessageCircle size={25} />
            <span>Connect</span>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={19} />
          </button>
        </header>

        <div className="current-user">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="person-info">
            <h3>{user?.name || "Your account"}</h3>
            <p>Signed in</p>
          </div>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search people..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search people"
          />
        </div>

        <div className="section-heading">
          <Users size={18} />
          <span>People</span>
          <span className="user-count">{filteredUsers.length}</span>
        </div>

        {error && !selectedConversation && (
          <p className="error-message">{error}</p>
        )}

        <div className="user-list">
          {filteredUsers.map((person) => {
            const conversation = getConversationForPerson(person);
            const preview =
              conversation?.lastMessage || "Start a conversation";
            const previewTime = formatTime(conversation?.lastMessageAt);
            const unreadCount = conversation?.unreadCount || 0;

            return (
              <button
                type="button"
                className="person-row"
                key={person._id}
                onClick={() => openConversation(person)}
              >
                <div className="avatar">
                  {person.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="person-info">
                  <div className="person-title-row">
                    <h3>{person.name}</h3>

                    {previewTime && (
                      <time className="conversation-time">
                        {previewTime}
                      </time>
                    )}
                  </div>

                  <div className="conversation-preview-row">
                    <p className="conversation-preview">{preview}</p>

                    {unreadCount > 0 && (
                      <span
                        className="unread-badge"
                        aria-label={`${unreadCount} unread messages`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>

                  <small>{person.status || "offline"}</small>
                </div>
              </button>
            );
          })}

          {!error && filteredUsers.length === 0 && (
            <p className="empty-users">
              {search
                ? "No matching users found."
                : "No other users yet. Create a second account to test chat."}
            </p>
          )}
        </div>
      </aside>

      <section
        className={`chat-welcome ${
          selectedConversation ? "conversation-active" : ""
        }`}
      >
        {!selectedConversation ? (
          <>
            <div className="welcome-icon">
              <MessageCircle size={38} />
            </div>

            <h1>Your conversations start here</h1>
            <p>Select a person from the sidebar to start chatting.</p>
          </>
        ) : (
          <div className="conversation-panel">
            <header className="conversation-header">
              <button
                type="button"
                className="icon-button mobile-back"
                onClick={() => {
                  selectedIdRef.current = null;
                  setSelectedConversation(null);
                  setMessages([]);
                  setError("");
                }}
                aria-label="Back to people"
              >
                <ArrowLeft size={19} />
              </button>

              <div className="avatar">
                {conversationName.charAt(0).toUpperCase()}
              </div>

              <div className="person-info">
                <h3>{conversationName}</h3>
                <p>{otherParticipant?.status || "Chat conversation"}</p>
              </div>
            </header>

            {error && <p className="error-message">{error}</p>}

            <div className="messages-area">
              {loadingMessages ? (
                <p className="message-placeholder">Loading messages...</p>
              ) : messages.length === 0 ? (
                <p className="message-placeholder">
                  No messages yet. Say hello!
                </p>
              ) : (
                messages.map((message) => {
                  const senderId = message.sender?._id || message.sender;
                  const isMine =
                    String(senderId) === String(user?._id || user?.id);

                  return (
                    <div
                      className={`message-row ${
                        isMine ? "mine" : "theirs"
                      }`}
                      key={message._id}
                    >
                      <div className="message-bubble">
                        <p>{message.text}</p>
                        <small>{formatTime(message.createdAt)}</small>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className="message-form" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Write a message..."
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                maxLength={5000}
                aria-label="Write a message"
              />

              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                aria-label="Send message"
                title="Send message"
              >
                <Send size={19} />
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
