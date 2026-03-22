import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitTestResult, getTestResult } from '../api/chatApi';

const QUESTIONS = [
  {
    id: 1,
    text: "Câu 1: Khái niệm cốt lõi của Trí tuệ Nhân tạo (AI) là gì?",
    options: ["A. Viết code HTML/CSS", "B. Khả năng máy móc mô phỏng trí tuệ con người", "C. Quản trị Cơ sở dữ liệu", "D. Sửa chữa phần cứng máy tính"],
    answer: 1 // B
  },
  {
    id: 2,
    text: "Câu 2: Python thường được dùng cho lĩnh vực nào nhiều nhất hiện nay?",
    options: ["A. Lập trình iOS", "B. Thiết kế giao diện Web", "C. Trí tuệ nhân tạo và Data Science", "D. Lập trình Game 3D"],
    answer: 2 // C
  },
  {
    id: 3,
    text: "Câu 3: 'RAG' (Retrieval-Augmented Generation) trong AI Chatbot có nghĩa là gì?",
    options: ["A. Một ngôn ngữ lập trình", "B. Tiếng ồn của dữ liệu", "C. Kỹ thuật giúp mô hình AI tìm kiếm thông tin bên ngoài trước khi trả lời", "D. Tên một thư viện React"],
    answer: 2 // C
  },
  {
    id: 4,
    text: "Câu 4: Supabase được xây dựng dựa trên hệ quản trị cơ sở dữ liệu nào?",
    options: ["A. MySQL", "B. MongoDB", "C. PostgreSQL", "D. SQLite"],
    answer: 2 // C
  },
  {
    id: 5,
    text: "Câu 5: Trong Kiến trúc phát triển Phần mềm, API dùng để làm gì?",
    options: ["A. Vẽ giao diện", "B. Cầu nối giao tiếp giữa các phần mềm/hệ thống", "C. Cài đặt hệ điều hành", "D. Bảo mật phần cứng"],
    answer: 1 // B
  }
];

function TestForm() {
  const [currentScore, setCurrentScore] = useState(null);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load kết quả cũ nếu có
    const loadResult = async () => {
      try {
        const data = await getTestResult();
        if (data && data.score !== undefined) {
          setCurrentScore(data.score);
        }
      } catch (err) {
        // Chưa có kết quả, bỏ qua
      }
    };
    loadResult();
  }, []);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < QUESTIONS.length) {
      setMessage("Vui lòng trả lời đầy đủ tất cả các câu hỏi!");
      return;
    }

    setIsSubmitting(true);
    let calculatedScore = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.answer) {
        calculatedScore += 20; // 5 câu, mỗi câu 20 điểm = full 100đ
      }
    });

    try {
      await submitTestResult({
        score: calculatedScore
      });
      setCurrentScore(calculatedScore);
      setMessage(`Bạn đạt được ${calculatedScore} điểm! Đang lưu kết quả và chuyển tới chat...`);
      setTimeout(() => navigate('/chat'), 2000);
    } catch (err) {
      setMessage('Lỗi: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Bài Đánh Giá Năng Lực (IT & AI)</h2>
      {currentScore !== null && (
        <div style={{ padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', marginBottom: '15px' }}>
          <strong>Điểm số hiện tại của bạn: {currentScore}/100</strong>
          <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>
            Làm lại bài test bên dưới sẽ ghi đè lên kết quả cũ và giúp bạn tăng cấp độ (Level) nếu đạt điểm cao hơn.
          </p>
        </div>
      )}
      
      {message && (
        <p style={{ color: message.includes('Lỗi') || message.includes('bảo') ? 'red' : 'green', fontWeight: 'bold' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {QUESTIONS.map((q, qIndex) => (
          <div key={q.id} style={{ 
            padding: '15px', 
            border: '1px solid #eee', 
            borderRadius: '5px',
            backgroundColor: Object.keys(answers).includes(q.id.toString()) ? '#f8fdf8' : '#fff'
          }}>
            <strong style={{ display: 'block', marginBottom: '10px' }}>{q.text}</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="radio" 
                    name={`question-${q.id}`} 
                    value={optIndex}
                    checked={answers[q.id] === optIndex}
                    onChange={() => handleOptionChange(q.id, optIndex)}
                    style={{ marginRight: '10px' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '12px', 
            backgroundColor: isSubmitting ? '#ccc' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '16px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}>
          {isSubmitting ? 'Đang chấm điểm...' : 'Nộp bài và Cập nhật năng lực'}
        </button>
      </form>
    </div>
  );
}

export default TestForm;
