// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaCamera } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getExpenses } from '../../services/expenseService';
import api from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    tagline: '',
    expensesShared: 0,
    friends: 0,
    memberSince: '',
    avatar: ''
  });
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    username: '',
    bio: '',
    profilePhoto: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        setProfile({
          username: `@${user.username}`,
          bio: user.bio || 'Expense Tracking Enthusiast',
          tagline: `Love sharing my spending journey and helping friends stay financially mindful! 💰`,
          expensesShared: 0, // TODO: Fetch from API
          friends: user.friends?.length || 0, // Use actual friends count
          memberSince: new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          avatar: user.profilePhoto ? `http://localhost:4000${user.profilePhoto}` : '/avatars/user.jpg'
        });

        // Load user's public expenses
        try {
          const expenses = await getExpenses();
          const publicExpenses = expenses.filter(expense => expense.isPublic);

          const transformedExpenses = publicExpenses.slice(0, 10).map(expense => ({
            id: expense._id,
            title: expense.description,
            timeAgo: new Date(expense.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }),
            likes: expense.likes?.length || 0,
            amount: expense.amount,
            icon: getCategoryIcon(expense.category)
          }));

          setSharedExpenses(transformedExpenses);
        } catch (error) {
          console.error('Failed to load expenses:', error);
          setSharedExpenses([]);
        }
      }
    };

    loadProfileData();
  }, [user]);


  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍽️',
      transport: '🚗',
      shopping: '🛒',
      entertainment: '🎬',
      bills: '💡',
      health: '🏥',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  const handleEditProfile = () => {
    setEditForm({
      fullName: user.fullName || '',
      username: user.username || '',
      bio: user.bio || '',
      profilePhoto: user.profilePhoto || ''
    });
    setPreviewUrl(user.profilePhoto ? `http://localhost:4000${user.profilePhoto}` : '/avatars/user.jpg');
    setShowEditModal(true);
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
    if (!selectedFile) return editForm.profilePhoto;

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

  const handleSaveProfile = async () => {
    try {
      console.log('🔍 Starting profile update...');
      console.log('User ID:', user._id);
      console.log('Update data:', {
        fullName: editForm.fullName,
        username: editForm.username,
        bio: editForm.bio,
        profilePhoto: editForm.profilePhoto
      });

      let profilePhotoUrl = editForm.profilePhoto;

      if (selectedFile) {
        console.log('📸 Uploading image...');
        profilePhotoUrl = await uploadImage();
        console.log('✅ Image uploaded:', profilePhotoUrl);
      }

      const updateData = {
        fullName: editForm.fullName,
        username: editForm.username,
        bio: editForm.bio,
        profilePhoto: profilePhotoUrl
      };

      console.log('📡 Making API request to:', `/users/${user._id}`);
      console.log('📡 Request data:', updateData);

      const response = await api.put(`/users/${user._id}`, updateData);
      console.log('✅ Profile update successful:', response.data);

      setShowEditModal(false);
      // Refresh the page to update user data
      window.location.reload();
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error headers:', error.response?.headers);

      // More specific error messages
      if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        alert('You can only update your own profile.');
      } else if (error.response?.status === 400) {
        alert(`Invalid data: ${error.response.data?.message || 'Please check your input.'}`);
      } else {
        alert(`Failed to update profile: ${error.response?.data?.message || error.message || 'Please try again.'}`);
      }
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <main className="container mx-auto px-6 py-8 md:px-8 lg:px-10">
        {/* Profile Header - with light gray border */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start space-x-6">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-500"
              />
              <div>
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-orange-500 text-base mb-2">{profile.bio}</p>
                <p className="text-gray-300 text-base mb-3 max-w-2xl">{profile.tagline}</p>
                <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                  <span>{profile.expensesShared} expenses shared</span>
                  <span>{profile.friends} friends</span>
                  <span>Member since {profile.memberSince}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 self-start"
            >
              <FaEdit /> <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
              <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                    />
                    <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-full cursor-pointer">
                      <FaCamera className="text-xs" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-300">Click the camera to change your profile picture</p>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    value={editForm.username}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    value={editForm.bio}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* "Your Shared Expenses" Section - with light gray border */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4">
            {user ? `${user.fullName}'s Shared Expenses` : 'Your Shared Expenses'}
          </h2>

          <div className="space-y-4">
            {sharedExpenses.length > 0 ? (
              sharedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-700 flex justify-between items-start hover:bg-gray-650 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-lg">
                      {expense.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{expense.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{expense.timeAgo} • {expense.likes} likes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="!text-yellow-400 font-bold text-lg">${Math.abs(expense.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No shared expenses yet. Start sharing your spending journey!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;