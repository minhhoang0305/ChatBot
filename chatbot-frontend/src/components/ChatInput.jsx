// Import useState hook để quản lý state input
import { useState } from "react";

/**
 * ChatInput Component - Input field để người dùng nhập và gửi message
 * @param {function} onSend - Callback hàm xử lý khi gửi message
 * @param {boolean} loading - Flag để disable input khi processing
 */
export default function ChatInput({ onSend, loading }) {
  // State lưu giá trị input hiện tại
  const [input, setInput] = useState("");

  /**
   * Hàm xử lý submit form
   * @param {Event} e - Event object từ form submit
   */
  const handleSubmit = (e) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();
    
    // Kiểm tra input có trống không (trim() để bỏ spaces)
    if (!input.trim()) return;

    // Gọi callback hàm onSend từ parent component
    onSend(input);
    
    // Clear input field sau khi gửi
    setInput("");
  };

  // JSX - Render form
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
      {/* Input field */}
      <input
        // Giá trị input được quản lý bởi state
        value={input}
        
        // Cập nhật state khi user type
        onChange={(e) => setInput(e.target.value)}
        
        // Placeholder text
        placeholder="Nhập tin nhắn..."
        
        // Styling
        style={{
          // Chiếm hết không gian
          flex: 1,
          // Padding bên trong
          padding: "10px",
          // Border radius
          borderRadius: "8px",
          // Border
          border: "1px solid #ccc",
          // Font size
          fontSize: "14px",
        }}
        
        // Disable input khi đang loading
        disabled={loading}
      />
      
      {/* Submit button */}
      <button
        // Type submit để trigger form.onSubmit
        type="submit"
        
        // Disable button khi loading
        disabled={loading}
        
        // Styling
        style={{
          // Padding
          padding: "10px 16px",
          // Border radius
          borderRadius: "8px",
          // Background color
          backgroundColor: loading ? "#ccc" : "#007bff",
          // Text color
          color: "white",
          // Border
          border: "none",
          // Cursor
          cursor: loading ? "not-allowed" : "pointer",
          // Font size
          fontSize: "14px",
          // Transition cho smooth effect
          transition: "background-color 0.2s",
        }}
      >
        {/* Show different text dựa vào loading state */}
        {loading ? "⏳ Đang xử lý..." : "📤 Gửi"}
      </button>
    </form>
  );
}