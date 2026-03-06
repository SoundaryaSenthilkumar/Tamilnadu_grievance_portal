import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const TrackComplaint = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const [complaintId, setComplaintId] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setResult({
      id: complaintId,
      status: isTamil ? 'நடைமுறையில்' : 'In Progress',
      department: isTamil ? 'குடிநீர் வழங்கல்' : 'Water Supply',
      subject: isTamil ? 'குடிநீர் வழங்கல் தடம் புரண்டுள்ளது' : 'Water supply disruption',
      date: '2024-01-15',
      timeline: [
        { status: isTamil ? 'புகார் பதிவு செய்யப்பட்டது' : 'Complaint Registered', date: '2024-01-15', completed: true },
        { status: isTamil ? 'துறைக்கு ஒதுக்கப்பட்டது' : 'Assigned to Department', date: '2024-01-16', completed: true },
        { status: isTamil ? 'விசாரணையில் உள்ளது' : 'Under Investigation', date: '2024-01-18', completed: true },
        { status: isTamil ? 'தீர்வு நடைமுறையில்' : 'Resolution in Progress', date: '2024-01-20', completed: false },
      ]
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-6">
            {isTamil ? 'உங்கள் புகாரை கண்காணிக்கவும்' : 'Track Your Complaint'}
          </h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder={isTamil ? 'புகார் ஐடி உள்ளிடவும் (உதா., TN123456)' : 'Enter Complaint ID (e.g., TN123456)'}
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-900">
              {isTamil ? 'கண்காணிக்க' : 'Track'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b gap-3">
              <div>
                <h2 className="text-2xl font-bold text-primary">{isTamil ? 'புகார் விவரங்கள்' : 'Complaint Details'}</h2>
                <p className="text-gray-600">{isTamil ? 'ஐடி' : 'ID'}: {result.id}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">
                {result.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-gray-600">{isTamil ? 'துறை' : 'Department'}</p>
                <p className="font-bold text-primary">{result.department}</p>
              </div>
              <div>
                <p className="text-gray-600">{isTamil ? 'பதிவு தேதி' : 'Registered Date'}</p>
                <p className="font-bold text-primary">{result.date}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">{isTamil ? 'பொருள்' : 'Subject'}</p>
                <p className="font-bold text-primary">{result.subject}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-primary mb-6">{isTamil ? 'புகார் காலவரிசை' : 'Complaint Timeline'}</h3>
            <div className="space-y-4">
              {result.timeline.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-500' : 'bg-gray-300'} text-white font-bold mr-4`}>
                    {item.completed ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${item.completed ? 'text-green-600' : 'text-gray-600'}`}>
                      {item.status}
                    </h4>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
