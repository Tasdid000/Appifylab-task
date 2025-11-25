import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useUserProfile from '../Body/useUserProfile';

const Navbar = () => {
  const { userData: user, clearUserData } = useUserProfile();
  const [showNotify, setShowNotify] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    clearUserData();
    Navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl5 xl:max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/feed" className="flex items-center">
          <img src="/assets/logo.svg" alt="Buddy Script" className="h-9 w-auto" />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2">
          {/* Home */}
          <Link className="nav-link _header_nav_link_active _header_nav_link" to="/feed">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
              <path className="_home_active" stroke="#000" strokeWidth="1.5" strokeOpacity=".6" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
              <path className="_home_active" stroke="#000" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
            </svg>
          </Link>

          {/* Friends */}
          <Link className="nav-link _header_nav_link" to="/friend-request">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="none" viewBox="0 0 26 20">
              <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z" clipRule="evenodd" />
            </svg>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotify(!showNotify)}
              className="nav-link _header_nav_link _header_notify_btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
              </svg>
              <span className="_counting">6</span>
            </button>

            {/* Notification Dropdown */}
            {showNotify && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
                  <div className="relative">
                    <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                        <circle cx="2" cy="2" r="2" fill="#C4C4C4"></circle>
                        <circle cx="2" cy="8" r="2" fill="#C4C4C4"></circle>
                        <circle cx="2" cy="15" r="2" fill="#C4C4C4"></circle>
                      </svg>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 hidden group-hover:block">
                      <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm">Mark all as read</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm">Notification settings</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 text-sm">Open notifications</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="_notifications_drop_btn_grp p-3">
                  <button className="_notifications_btn_link">All</button>
                  <button className="_notifications_btn_link1">Unread</button>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  <div class="_notifications_all">
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/friend-req.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          <span class="_notify_txt_link">
                            Steve Jobs
                          </span>
                          posted a link in your timeline.
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div class="_notification_box">
                      <div class="_notification_image">
                        <img src="assets/profile-1.png" alt="Image"
                          class="_notify_img" />
                      </div>
                      <div class="_notification_txt">
                        <p class="_notification_para">
                          An admin changed the name of the group
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                          to
                          <span class="_notify_txt_link">
                            Freelacer usa
                          </span>
                        </p>
                        <div class="_nitification_time">
                          <span>42 miniutes ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Messages */}
          <Link className="nav-link _header_nav_link" to="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="none" viewBox="0 0 23 22">
              <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.239 7.833 3.489 4.32 4.648 4.32 12.211 0 16.86-2.294 2.28-5.384 3.486-8.514 3.486-1.706 0-3.423-.358-5.03-1.097-.474-.188-.917-.366-1.235-.366-.366.003-.859.171-1.335.334-.976.333-2.19.748-3.09-.142-.895-.89-.482-2.093-.149-3.061.164-.477.333-.97.333-1.342 0-.306-.149-.697-.376-1.259C-1 12.417-.032 7.011 3.516 3.49A11.96 11.96 0 0112.002 0zm.001 1.663a10.293 10.293 0 00-7.304 3.003A10.253 10.253 0 002.63 16.244c.261.642.514 1.267.514 1.917 0 .649-.225 1.302-.422 1.878-.163.475-.41 1.191-.252 1.349.156.16.881-.092 1.36-.255.576-.195 1.228-.42 1.874-.424.648 0 1.259.244 1.905.503 3.96 1.818 8.645.99 11.697-2.039 4.026-4 4.026-10.509 0-14.508a10.294 10.294 0 00-7.303-3.002zm4.407 9.607c.617 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 01-1.12-1.11c0-.613.494-1.108 1.11-1.108h.01zm-4.476 0c.616 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 01-1.121-1.11c0-.613.493-1.108 1.11-1.108h.01zm-4.477 0c.617 0 1.117.495 1.117 1.109 0 .613-.5 1.109-1.117 1.109a1.116 1.116 0 01-1.12-1.11c0-.613.494-1.108 1.11-1.108h.01z" clipRule="evenodd" />
            </svg>
            <span className="_counting">2</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative ml-3">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.data?.image ? (
                  <img
                    src={`http://127.0.0.1:8000${user.data.image}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.data?.first_name?.[0] || 'U'}</span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.data?.first_name} {user?.data?.last_name || 'User'}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                      {user?.data?.image ? (
                        <img src={`http://127.0.0.1:8000${user.data.image}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                          {user?.data?.first_name?.[0] || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{user?.data?.first_name} {user?.data?.last_name}</h4>
                      <Link to="/dashboard/userprofile" className="text-sm text-blue-600 hover:underline">View Profile</Link>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19"
                        fill="none" viewBox="0 0 18 19">
                        <path fill="#377DFF"
                          d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17zm0 1.375h-1.17c-.287 0-.562.113-.764.312-.179.177-.288.41-.308.628l-.012.29c-.098 1.262-1.172 2.253-2.486 2.253a2.475 2.475 0 01-1.013-.231l-.182-.095a1.1 1.1 0 00-1.488.407l-.616.993a1.05 1.05 0 00.296 1.392l.247.153A2.43 2.43 0 013.181 9.5c0 .802-.401 1.552-1.095 2.023l-.147.091c-.486.276-.674.873-.448 1.342l.053.102.597 1.01c.14.248.374.431.652.509.246.069.51.05.714-.04l.103-.05a2.506 2.506 0 011.882-.248 2.456 2.456 0 011.823 2.1l.02.335c.059.535.52.95 1.079.95h1.17c.566 0 1.036-.427 1.08-.95l.005-.104a2.412 2.412 0 01.726-1.732 2.508 2.508 0 011.779-.713c.331.009.658.082.992.23l.3.15c.469.202 1.026.054 1.309-.344l.068-.105.61-1a1.045 1.045 0 00-.288-1.383l-.257-.16a2.435 2.435 0 01-1.006-1.389 2.393 2.393 0 01.25-1.847c.181-.31.429-.575.752-.795l.152-.095c.485-.278.672-.875.448-1.346l-.067-.127-.012-.027-.554-.945a1.095 1.095 0 00-1.27-.487l-.105.041-.098.049a2.515 2.515 0 01-1.88.259 2.47 2.47 0 01-1.511-1.122 2.367 2.367 0 01-.325-.97l-.012-.24a1.056 1.056 0 00-.307-.774 1.096 1.096 0 00-.779-.323zm-.58 5.02c1.744 0 3.16 1.39 3.16 3.105s-1.416 3.105-3.16 3.105c-1.746 0-3.161-1.39-3.161-3.105s1.415-3.105 3.16-3.105zm0 1.376c-.973 0-1.761.774-1.761 1.729 0 .955.788 1.73 1.76 1.73s1.76-.775 1.76-1.73-.788-1.73-1.76-1.73z" />
                      </svg>
                    </span>
                    <span>Settings</span>
                    <button type="submit" class="_nav_drop_btn_link text-align-right ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10"
                        fill="none" viewBox="0 0 6 10">
                        <path fill="#112032"
                          d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                          opacity=".5" />
                      </svg>
                    </button>
                  </Link>

                  <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                          fill="none" viewBox="0 0 20 20">
                          <path stroke="#377DFF" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="1.5"
                            d="M10 19a9 9 0 100-18 9 9 0 000 18z" />
                          <path stroke="#377DFF" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="1.5"
                            d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009" />
                        </svg>
                      </span>
                    </span>
                    <span>Help & Support</span>
                    <button type="submit" class="_nav_drop_btn_link text-align-right ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10"
                        fill="none" viewBox="0 0 6 10">
                        <path fill="#112032"
                          d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                          opacity=".5" />
                      </svg>
                    </button>
                  </Link>
                  <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" onClick={handleLogout}>
                    <span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                          fill="none" viewBox="0 0 19 19">
                          <path stroke="#377DFF" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="1.5"
                            d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667" />
                        </svg>
                      </span>
                    </span>
                    <span>Log Out</span>
                    <button type="submit" class="_nav_drop_btn_link text-align-right ml-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10"
                        fill="none" viewBox="0 0 6 10">
                        <path fill="#112032"
                          d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                          opacity=".5" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;