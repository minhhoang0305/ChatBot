// Import React hook useState để quản lý state
import { useState } from "react";
// Import hàm API gửi message
import { sendMessage } from "../api/chatApi";
// Import component hiển thị từng message
import MessageBubble from "./MessageBubble";
// Import component input để người dùng nhập message
import ChatInput from "./ChatInput";
import { useNavigate } from "react-router-dom";

// Component chính ChatWindow - Quản lý toàn bộ giao diện chat
export default function ChatWindow() {
  const navigate = useNavigate();
  // State lưu danh sách messages (user + assistant)
  const [messages, setMessages] = useState([]);
  
  // State lưu ID của conversation hiện tại (để phục vụ multi-turn)
  const [conversationId, setConversationId] = useState(null);
  
  // State để show loading state khi chờ response từ backend
  const [loading, setLoading] = useState(false);

  /**
   * Hàm xử lý khi người dùng gửi message
   * @param {string} text - Nội dung message từ input
   */
  const handleSend = async (text) => {
    // Tạo object message của user
    const userMessage = { role: "user", content: text };

    // Thêm user message vào state (update UI ngay lập tức)
    setMessages((prev) => [...prev, userMessage]);
    
    // Set loading = true để disable input và show loading state
    setLoading(true);

    try {
      // Gọi API gửi message tới backend
      // Gửi kèm conversationId (nếu có) để backend biết là continuation
      const data = await sendMessage(conversationId, text);

      // Tạo object message từ response của assistant
      const assistantMessage = {
        role: "assistant",
        content: data.reply,
      };

      // Lưu conversation ID từ backend (dùng cho turn tiếp theo)
      setConversationId(data.conversation_id);

      // Thêm assistant message vào state
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Log lỗi để debug
      console.error(error);
      // Show error alert cho user
      alert("Có lỗi xảy ra.");
    } finally {
      // Tắt loading state dù có lỗi hay không
      setLoading(false);
    }
  };

  // JSX - Render giao diện
  return (
    <div
      style={{
        // Giới hạn chiều rộng
        maxWidth: "600px",
        // Căn giữa
        margin: "40px auto",
        // Flex container
        display: "flex",
        flexDirection: "column",
        // Chiều cao
        height: "80vh",
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd', marginBottom: '10px' }}>
        <div>
          <button onClick={() => navigate('/test')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff', marginRight: '15px' }}>
            📝 Cập nhật năng lực
          </button>
          <button onClick={() => navigate('/admin-data')} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#28a745' }}>
            🛠 Nạp dữ liệu (Admin)
          </button>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'red' }}>
          🚪 Đăng xuất
        </button>
      </div>

      {/* Container hiển thị messages */}
      <div
        style={{
          // Chiếm hết không gian còn lại
          flex: 1,
          // Scrollable nếu messages quá nhiều
          overflowY: "auto",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* Render từng message bằng map */}
        {messages.map((msg, idx) => (
          // Mỗi message render dưới dạng MessageBubble
          // key = idx (ideally should be unique ID)
          // role = "user" hoặc "assistant" để style khác nhau
          // content = nội dung message
          <MessageBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        
        {/* Show loading indicator khi đang chờ response */}
        {loading && (
          <div style={{ textAlign: "center", color: "#999", marginTop: "10px" }}>
            ⏳ Đang xử lý...
          </div>
        )}
      </div>

      {/* Spacer nhỏ giữa messages và input */}
      <div style={{ height: "10px" }} />

      {/* Input component để người dùng gửi message */}
      {/* onSend = callback hàm xử lý khi gửi */}
      {/* loading = prop để disable input khi processing */}
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}