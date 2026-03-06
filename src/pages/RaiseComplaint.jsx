import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const RaiseComplaint = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', subject: '', description: '', file: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = 'TN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setComplaintId(id);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'file' ? files?.[0] || null : value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              {isTamil ? 'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Complaint Registered Successfully!'}
            </h2>
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-2">{isTamil ? 'உங்கள் புகார் ஐடி:' : 'Your Complaint ID:'}</p>
              <p className="text-3xl font-bold text-primary">{complaintId}</p>
            </div>
            <p className="text-gray-600 mb-6">
              {isTamil
                ? 'புகாரை கண்காணிக்க இந்த ஐடியை சேமித்து வைத்துக்கொள்ளவும்.'
                : 'Please save this ID for tracking your complaint status.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setSubmitted(false)} className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-900">
                {isTamil ? 'மற்றொரு புகார் பதிவு' : 'Submit Another Complaint'}
              </button>
              <a href="/track-complaint" className="bg-secondary text-primary px-6 py-3 rounded-lg hover:bg-yellow-500 font-bold">
                {isTamil ? 'புகார் கண்காணிப்பு' : 'Track Complaint'}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-6">
            {isTamil ? 'உங்கள் புகாரை பதிவு செய்யவும்' : 'Register Your Complaint'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'முழுப்பெயர் *' : 'Full Name *'}</label>
                <input type="text" name="name" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'மின்னஞ்சல் *' : 'Email *'}</label>
                <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'தொலைபேசி எண் *' : 'Phone Number *'}</label>
                <input type="tel" name="phone" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'துறை *' : 'Department *'}</label>
                <select name="department" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary">
                  <option value="">{isTamil ? 'துறையைத் தேர்ந்தெடுக்கவும்' : 'Select Department'}</option>
                  <option>{isTamil ? 'வருவாய் துறை' : 'Revenue Department'}</option>
                  <option>{isTamil ? 'காவல் துறை' : 'Police Department'}</option>
                  <option>{isTamil ? 'மின்சார வாரியம்' : 'Electricity Board'}</option>
                  <option>{isTamil ? 'குடிநீர் வழங்கல்' : 'Water Supply'}</option>
                  <option>{isTamil ? 'நகராட்சி நிர்வாகம்' : 'Municipal Administration'}</option>
                  <option>{isTamil ? 'போக்குவரத்து துறை' : 'Transport Department'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'பொருள் *' : 'Subject *'}</label>
              <input type="text" name="subject" required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">{isTamil ? 'விவரம் *' : 'Description *'}</label>
              <textarea name="description" required onChange={handleChange} rows="5" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {isTamil ? 'ஆவணம் இணைப்பு (விருப்பத்தேர்வு)' : 'Attach Document (Optional)'}
              </label>
              <input type="file" name="file" onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-900 transition">
              {isTamil ? 'புகார் சமர்ப்பிக்கவும்' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaint;
