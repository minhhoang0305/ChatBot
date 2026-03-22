import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import TestForm from "./components/TestForm";
import AdminPage from "./components/AdminPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div>
        <h2 style={{ textAlign: "center" }}>
          💬 Chatbot E-Learning
        </h2>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={
            <ProtectedRoute>
              <TestForm />
            </ProtectedRoute>
          } />
          <Route path="/admin-data" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;