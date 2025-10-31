import React, { useState, useEffect } from 'react';
import { FaSave, FaCamera } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    fullName: '',
    username: '',
    bio: '',
    profilePhoto: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setSettings({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || '',
        profilePhoto: user.profilePhoto || ''
      });
      setPreviewUrl(user.profilePhoto ? `http://localhost:4000${user.profilePhoto}` : '/avatars/user.jpg');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return settings.profilePhoto;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const { data } = await api.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let profilePhotoUrl = settings.profilePhoto;

      if (selectedFile) {
        profilePhotoUrl = await uploadImage();
      }

      const updateData = {
        fullName: settings.fullName,
        username: settings.username,
        bio: settings.bio,
        profilePhoto: profilePhotoUrl
      };

      await api.put(`/users/${user._id}`, updateData);

      // Update local user context if needed
      window.location.reload(); // Simple refresh to update user data

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access settings</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-6 py-8 md:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences.</p>
        </div>

        {/* Settings Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">

            {/* Profile Picture Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-orange-500"
                  />
                  <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer">
                    <FaCamera className="text-sm" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">
                    Upload a new profile picture. Max size: 5MB. Supported formats: PNG, JPEG, WebP.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={settings.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={settings.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={settings.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <FaSave />
                <span>{loading ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;