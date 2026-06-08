import { useState } from 'react';
import { User, Shield, UserCog } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'citizen',
      name: 'Citizen',
      icon: <User className="w-12 h-12" />,
      description: 'Submit and track your complaints',
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: <Shield className="w-12 h-12" />,
      description: 'Manage complaints and departments',
    },
    {
      id: 'officer',
      name: 'Department Officer',
      icon: <UserCog className="w-12 h-12" />,
      description: 'Handle assigned complaints',
    },
  ];

  const handleLogin = () => {
    if (selectedRole) {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 md:p-6 bg-white">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full p-2 md:p-4 shadow-lg mx-auto mb-3 md:mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="#FF9933" />
              <circle cx="50" cy="50" r="35" fill="#FFFFFF" />
              <circle cx="50" cy="50" r="25" fill="#138808" />
              <circle cx="50" cy="50" r="15" fill="#000080" />
              <circle cx="50" cy="50" r="5" fill="#FFD700" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#0f766e] mb-1 md:mb-2">
            Tamil Nadu Public Grievance Redressal Portal
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-600">
            தமிழ்நாடு பொது குறைதீர்ப்பு போர்டல்
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl border border-gray-200">
          <h2 className="text-lg md:text-2xl text-gray-800 mb-4 md:mb-6 text-center">
            Select Your Role to Continue
          </h2>

          {/* Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedRole === role.id
                    ? 'border-[#0f766e] bg-[#f0fdfa] shadow-lg'
                    : 'border-gray-300 bg-white hover:border-[#0f766e]'
                }`}
              >
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#0f766e] text-white flex items-center justify-center mx-auto mb-3 md:mb-4`}
                >
                  {role.icon}
                </div>
                <h3 className="text-base md:text-lg text-gray-800 mb-1 md:mb-2 text-center">
                  {role.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 text-center">
                  {role.description}
                </p>
                {selectedRole === role.id && (
                  <div className="absolute top-2 right-2 w-5 md:w-6 h-5 md:h-6 bg-[#0f766e] rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Login Button */}
          <div className="text-center">
            <button
              onClick={handleLogin}
              disabled={!selectedRole}
              className="px-6 md:px-8 py-2 md:py-3 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md:text-base"
            >
              Continue to Dashboard
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
            <p>This is a demo portal. Select any role to explore the system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
