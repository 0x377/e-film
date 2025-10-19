import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEdit, FaCheck, FaTimes, FaCog, FaBell, FaLock, FaGlobe } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/api/placeholder/150/150',
    membership: 'Premium',
    joinDate: 'January 2023',
    language: 'English',
    notifications: true,
    autoPlay: true,
    matureContent: false
  });

  const [editData, setEditData] = useState(userData);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const profiles = [
    { id: 1, name: 'John', avatar: '/api/placeholder/100/100', isCurrent: true },
    { id: 2, name: 'Kids', avatar: '/api/placeholder/100/100', isCurrent: false },
    { id: 3, name: 'Add Profile', avatar: null, isAdd: true }
  ];

  return (
    <div className="profile-page">
      <div className="container">
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Account Settings</h1>
          <p>Manage your E-FILM profile and preferences</p>
        </motion.div>

        <div className="profile-layout">
          {/* Sidebar */}
          <motion.div 
            className="profile-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <nav className="sidebar-nav">
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaUser /> Profile
              </button>
              <button 
                className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => setActiveTab('preferences')}
              >
                <FaCog /> Preferences
              </button>
              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell /> Notifications
              </button>
              <button 
                className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                <FaLock /> Privacy & Security
              </button>
              <button 
                className={`nav-item ${activeTab === 'language' ? 'active' : ''}`}
                onClick={() => setActiveTab('language')}
              >
                <FaGlobe /> Language
              </button>
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="profile-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  className="tab-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="content-header">
                    <h2>Profile Information</h2>
                    {!isEditing && (
                      <button className="edit-btn" onClick={handleEdit}>
                        <FaEdit /> Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <motion.div
                      className="edit-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-actions">
                        <button className="btn btn-primary" onClick={handleSave}>
                          <FaCheck /> Save Changes
                        </button>
                        <button className="btn btn-outline-light" onClick={handleCancel}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="profile-info">
                      <div className="info-item">
                        <strong>Name:</strong>
                        <span>{userData.name}</span>
                      </div>
                      <div className="info-item">
                        <strong>Email:</strong>
                        <span>{userData.email}</span>
                      </div>
                      <div className="info-item">
                        <strong>Membership:</strong>
                        <span className="membership-badge">{userData.membership}</span>
                      </div>
                      <div className="info-item">
                        <strong>Member Since:</strong>
                        <span>{userData.joinDate}</span>
                      </div>
                    </div>
                  )}

                  <div className="profiles-section">
                    <h3>Profiles</h3>
                    <div className="profiles-grid">
                      {profiles.map(profile => (
                        <div key={profile.id} className="profile-card">
                          {profile.isAdd ? (
                            <div className="profile-add">
                              <div className="add-icon">+</div>
                              <span>Add Profile</span>
                            </div>
                          ) : (
                            <>
                              <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
                              <span className="profile-name">{profile.name}</span>
                              {profile.isCurrent && <div className="current-badge">Current</div>}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  className="tab-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2>Playback Preferences</h2>
                  <div className="preferences-list">
                    <div className="preference-item">
                      <div className="preference-info">
                        <h4>Autoplay Next Episode</h4>
                        <p>Play next episode automatically</p>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={userData.autoPlay}
                          onChange={(e) => handleInputChange('autoPlay', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    
                    <div className="preference-item">
                      <div className="preference-info">
                        <h4>Mature Content</h4>
                        <p>Show movies and TV shows with mature content</p>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={userData.matureContent}
                          onChange={(e) => handleInputChange('matureContent', e.target.checked)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Add other tabs content similarly */}
              
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
