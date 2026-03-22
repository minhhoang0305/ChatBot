# 🤖 AI Chatbot - For E-Learning

Ứng dụng chatbot thông minh được xây dựng bằng **Django** (backend) và **React** (frontend), sử dụng công nghệ LLM hiện đại để cung cấp trải nghiệm trò chuyện tương tác và hỗ trợ người dùng một cách hiệu quả.

## 📌 Giới thiệu dự án

**Chatbotez** là một nền tảng chatbot AI được thiết kế để:

- 💬 **Trò chuyện thông minh**: Sử dụng Google Generative AI (hoặc các LLM khác) để hiểu và trả lời các câu hỏi của người dùng một cách tự nhiên
- 📚 **Quản lý cuộc hội thoại**: Lưu trữ và quản lý lịch sử các cuộc trò chuyện với mỗi người dùng theo ID duy nhất
- 🧠 **Tìm kiếm thông minh**: Sử dụng Supabase + pgvector để indexing và tìm kiếm tài liệu nhanh chóng
- 📄 **Nhập dữ liệu linh hoạt**: Hỗ trợ nhập dữ liệu từ các file text và PDF để chatbot có thể học từ tài liệu của công ty
- 🔍 **Tìm kiếm web**: Tích hợp Tavily API để tìm kiếm thông tin trên mạng khi cần thiết
- ⚡ **Giao diện hiện đại**: Xây dựng bằng React + Vite với trải nghiệm người dùng mượt mà, responsive trên mọi thiết bị

## 🎯 Mục đích sử dụng

Dự án này phù hợp với các trường hợp:

- **Hỗ trợ khách hàng 24/7**: Chatbot tự động trả lời các câu hỏi thường gặp
- **Quản lý tài liệu nội bộ**: Giúp nhân viên tìm kiếm thông tin về chính sách, quy định công ty
- **Tư vấn AI cá nhân hóa**: Cung cấp thông tin hướng dẫn dựa trên kiến thức cụ thể của tổ chức
- **Nghiên cứu và phân tích**: Xử lý lượng lớn tài liệu và trích xuất thông tin hữu ích

## 🛠️ Stack công nghệ

### Backend
- **Django 5.2** - Web framework Python
- **Django REST Framework** - API development
- **LangChain & LangGraph** - Framework cho LLM applications
- **Google Generative AI** - Large Language Model (Gemini)
- **Supabase** - PostgreSQL + pgvector cho vector database
- **Sentence Transformers** - AI embeddings

### Frontend
- **React 19** - UI library
- **Vite** - Build tool hiệu suất cao
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

## 📁 Cấu trúc dự án

```
chatbot/
├── ai_backend/          # Django backend
│   ├── apps/
│   │   ├── chat/        # Chat API & models
│   │   └── ai/          # AI Agent & LLM logic
│   ├── data/            # Dữ liệu text để nhập vào chatbot
│   └── requirements.txt
├── chatbot-frontend/    # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── api/         # API integration
│   └── package.json
└── README.md
```

## 💡 Tính năng chính

✅ **Conversation Management** - Lưu lại toàn bộ lịch sử chat  
✅ **Context Awareness** - Hiểu được ngữ cảnh cuộc hội thoại  
✅ **Knowledge Base Integration** - Tìm kiếm trong dữ liệu công ty  
✅ **Real-time Chat UI** - Giao diện trò chuyện thời gian thực  
✅ **API-driven Architecture** - Dễ dàng mở rộng và tích hợp  

---

**Version:** 1.0.0 | **Status:** Active Development
