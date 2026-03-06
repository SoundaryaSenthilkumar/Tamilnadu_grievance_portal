import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const AdminLogin = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isTamil ? 'நிர்வாகி உள்நுழைவு அம்சம் பின்னணி இணைப்புடன் செயல்படுத்தப்படும்.' : 'Admin login functionality will be implemented with backend');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-primary">{isTamil ? 'நிர்வாகி உள்நுழைவு' : 'Admin Login'}</h1>
          <p className="text-gray-600 mt-2">
            {isTamil ? 'தமிழ்நாடு குறைதீர் தளம்' : 'Tamil Nadu Grievance Portal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'பயனர்பெயர்' : 'Username'}</label>
            <input
              type="text"
              required
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder={isTamil ? 'பயனர்பெயரை உள்ளிடவும்' : 'Enter username'}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'கடவுச்சொல்' : 'Password'}</label>
            <input
              type="password"
              required
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder={isTamil ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Enter password'}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-900 transition"
          >
            {isTamil ? 'உள்நுழைவு' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-primary hover:text-blue-900 text-sm">
            {isTamil ? 'கடவுச்சொல் மறந்துவிட்டதா?' : 'Forgot Password?'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
