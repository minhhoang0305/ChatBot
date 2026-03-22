import React, { useState } from 'react';
import { ingestAdminData } from '../api/chatApi';

function AdminPage() {
  const [inputType, setInputType] = useState('text');
  const [text, setText] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputType === 'text' && !text) {
      setMessage("Vui lòng nhập nội dung.");
      return;
    }
    if (inputType === 'file' && !file) {
      setMessage("Vui lòng chọn 1 file PDF.");
      return;
    }

    setLoading(true);
    setMessage("Đang xử lý nội dung lên cơ sở dữ liệu...");
    
    try {
      const formData = new FormData();
      formData.append('inputType', inputType);
      
      if (inputType === 'text') {
        formData.append('text', text);
        formData.append('source_name', sourceName || "Dữ liệu Add bởi Admin");
      } else {
        formData.append('file', file);
      }

      const data = await ingestAdminData(formData);
      setMessage("✅ " + data.message);
      setText('');
      setSourceName('');
      setFile(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setMessage("❌ Lỗi: Tài khoản của bạn không có đặc quyền Admin để Upload.");
      } else if (err.response?.status === 401) {
        setMessage("❌ Lỗi: Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
      } else {
        setMessage("❌ Lỗi: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ color: '#007bff' }}>🛠 Kênh Dữ liệu Nội bộ (Admin)</h2>
      <p>Cập nhật tài liệu mới dưới dạng Văn bản (Text) hoặc Tệp tin PDF. Hệ thống sẽ ngay lập tức nhúng (Vectorize) vào Supabase để Chatbot đọc được.</p>
      
      {message && <p style={{ padding: '10px', backgroundColor: message.includes('Lỗi') ? '#f8d7da' : '#d4edda', color: message.includes('Lỗi') ? '#721c24' : '#155724', borderRadius: '5px' }}>{message}</p>}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', marginTop: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
          <input 
            type="radio" 
            checked={inputType === 'text'} 
            onChange={() => setInputType('text')} 
            style={{ marginRight: '8px', transform: 'scale(1.2)' }}
          />
          Nhập Văn Bản
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
          <input 
            type="radio" 
            checked={inputType === 'file'} 
            onChange={() => setInputType('file')} 
            style={{ marginRight: '8px', transform: 'scale(1.2)' }}
          />
          Tải file PDF lên
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {inputType === 'text' ? (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nguồn gốc / Tên tài liệu (Tùy chọn):</label>
              <input 
                type="text" 
                value={sourceName} 
                onChange={(e) => setSourceName(e.target.value)} 
                placeholder="VD: Thông báo quy chế mới T10"
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nội dung văn bản:</label>
              <textarea 
                rows="10" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Sao chép toàn bộ văn bản và dán vào đây..."
                style={{ width: '100%', padding: '10px' }}
                required={inputType === 'text'}
              />
            </div>
          </>
        ) : (
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Chọn file PDF từ máy tính của bạn:</label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => setFile(e.target.files[0])} 
              required={inputType === 'file'}
              style={{ width: '100%', padding: '15px', border: '2px dashed #007bff', borderRadius: '5px', cursor: 'pointer' }}
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', marginTop: '10px', backgroundColor: loading ? '#6c757d' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          {loading ? 'Hệ thống đang xử lý...' : 'Upload Thông Tin Nội Bộ'}
        </button>
      </form>
    </div>
  );
}

export default AdminPage;
