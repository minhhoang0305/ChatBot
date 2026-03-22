import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/chatApi';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const data = await login(username, password);
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        navigate('/');
      } else {
        await register(username, email, password);
        setIsLogin(true); // Switch to login after register
        setError('Đăng ký thành công! Vui lòng đăng nhập.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
      {error && <p style={{ color: isLogin && error.includes('thành công') ? 'green' : 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        {!isLogin && (
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        )}
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLogin ? 'Đăng nhập' : 'Đăng ký'}
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
        <button 
          onClick={() => { setIsLogin(!isLogin); setError(''); }} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
        </button>
      </p>
    </div>
  );
}

export default Login;
