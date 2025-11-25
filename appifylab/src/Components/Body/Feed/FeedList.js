import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User2,
  Calendar,
  X,
  EditIcon,
} from "lucide-react";
import useUserProfile from "../useUserProfile";
import EditFeed from "../UserDashboard/OwnFeed/Editownfeed";


const FeedList = () => {
  const { userData, loading: userLoading } = useUserProfile();
  const [feeds, setFeeds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentTexts, setCommentTexts] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [expandedFeeds, setExpandedFeeds] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [likedUsersModal, setLikedUsersModal] = useState({
    open: false,
    title: "",
    users: [],
  });
  const [blankEditModal, setBlankEditModal] = useState({
    open: false,
    feedId: null,        // This will hold the ID of the post being edited
    feed: null           // Optional: store whole feed object later
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const replyInputRefs = useRef({});

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        if (!token) return navigate("/login");
        const res = await axios.get("http://127.0.0.1:8000/apiv1/user/feeds/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFeeds(sorted);
      } catch (err) {
        console.error(err);
        setErrorMessage("Error fetching feeds");
      }
    };
    if (!userLoading) fetchFeeds();
  }, [userLoading, navigate, token]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-wrapper")) {
        setDropdownOpen({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (userLoading) return <p className="text-center mt-8">Loading...</p>;

  const truncateHTMLContent = (html, wordLimit = 40) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return html;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const toggleReadMode = (feedId) =>
    setExpandedFeeds((p) => ({ ...p, [feedId]: !p[feedId] }));

  const toggleComments = (feedId) =>
    setCommentsVisible((p) => ({ ...p, [feedId]: !p[feedId] }));

  const openLikedModal = (title, users = []) => {
    setLikedUsersModal({ open: true, title, users });
  };

  const closeLikedModal = () => setLikedUsersModal({ open: false, title: "", users: [] });

  // LIKE POST
  const toggleLike = async (feedId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeeds((prev) =>
        prev.map((f) =>
          f.id === feedId
            ? {
              ...f,
              liked_by_user: !f.liked_by_user,
              likes_count: f.liked_by_user ? f.likes_count - 1 : f.likes_count + 1,
            }
            : f
        )
      );
    } catch (err) {
      alert("Failed to like post");
    }
  };

  // COMMENT ACTIONS
  const postComment = async (feedId) => {
    const content = commentTexts[feedId]?.trim();
    if (!content) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentTexts((p) => ({ ...p, [feedId]: "" }));

      const res = await axios.get(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeeds((prev) =>
        prev.map((f) => (f.id === feedId ? { ...f, comments: res.data } : f))
      );
    } catch (err) {
      alert("Failed to post comment");
    }
  };

  const likeComment = async (feedId, commentId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeeds((prev) =>
        prev.map((f) => (f.id === feedId ? { ...f, comments: res.data } : f))
      );
    } catch (err) {
      alert("Failed to like comment");
    }
  };

  // REPLY ACTIONS
  const toggleReplyInput = (commentId) => {
    setReplyOpen((p) => ({ ...p, [commentId]: !p[commentId] }));
    setTimeout(() => replyInputRefs.current[commentId]?.focus(), 100);
  };

  const postReply = async (feedId, commentId) => {
    const content = replyTexts[commentId]?.trim();
    if (!content) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/${commentId}/replies/`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyTexts((p) => ({ ...p, [commentId]: "" }));
      setReplyOpen((p) => ({ ...p, [commentId]: false }));

      const res = await axios.get(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeeds((prev) =>
        prev.map((f) => (f.id === feedId ? { ...f, comments: res.data } : f))
      );
    } catch (err) {
      alert("Failed to post reply");
    }
  };

  const likeReply = async (feedId, commentId, replyId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/${commentId}/replies/${replyId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(
        `http://127.0.0.1:8000/apiv1/user/feeds/${feedId}/comments/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeeds((prev) =>
        prev.map((f) => (f.id === feedId ? { ...f, comments: res.data } : f))
      );
    } catch (err) {
      alert("Failed to like reply");
    }
  };
  //delete post
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feed?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/apiv1/user/feeds/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the deleted feed from state
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== id));
    } catch (err) {
      alert("Failed to delete feed. Try again.");
      console.error(err);
    }
  };
  // GET WORD COUNT SAFELY
  const getWordCount = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim().split(/\s+/).length;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

      {feeds.map((feed) => {
        const isExpanded = expandedFeeds[feed.id];
        const showComments = commentsVisible[feed.id];

        return (
          <div
            key={feed.id}
            className="rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition relative"
          >
            <div className="absolute top-3 right-3 z-40 dropdown-wrapper">

              {/* 3 Dot Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(feed.id);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen[feed.id] && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white shadow-lg border border-gray-200 rounded-xl py-2 z-50 transition-all duration-200 scale-95 origin-top-right animate-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="flex flex-col space-y-1">

                    {/* Save Post */}
                    <li>
                      <a
                        href="#0"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <span className="mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2"
                              d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                          </svg>
                        </span>
                        Save Post
                      </a>
                    </li>

                    {/* Turn On Notification */}
                    <li>
                      <a
                        href="#0"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <span className="mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                            <path fill="#377DFF" fillRule="evenodd"
                              d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                              clipRule="evenodd" />
                          </svg>
                        </span>
                        Turn On Notification
                      </a>
                    </li>

                    {/* Hide */}
                    <li>
                      <a
                        href="#0"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <span className="mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                            <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2"
                              d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
                          </svg>
                        </span>
                        Hide
                      </a>
                    </li>

                    {/* Edit Post */}
                    {userData.data.email === feed.author.email && (
                      <li>
                        <button
                          className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 text-left"
                          onClick={() => {
                            setBlankEditModal({
                              open: true,
                              feedId: feed.id,           // Pass the correct feed ID
                              feed: feed                 // Optional: pass whole feed for later use
                            });
                            setDropdownOpen({});         // Close dropdown
                          }}
                        >
                          <span className="mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                              <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2"
                                d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                              <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2"
                                d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                            </svg>
                          </span>
                          Edit Post
                        </button>
                      </li>
                    )}
                    {userData.data.email === feed.author.email && (
                      <li>
                        <a
                          href="#0"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                          onClick={() => handleDelete(feed.id)}
                        >
                          <span className="mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                              <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2"
                                d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                            </svg>
                          </span>
                          Delete Post
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>


            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full  overflow-hidden flex-shrink-0">
                {feed.author.image ? (
                  <img src={feed.author.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User2 className="w-full h-full p-2 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                {/* Name */}
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 hover:underline cursor-pointer">
                    {feed.author.first_name} {feed.author.last_name}
                  </p>
                </div>

                {/* Time + Privacy */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {(() => {
                      const diffMs = Date.now() - new Date(feed.created_at).getTime();
                      const sec = Math.floor(diffMs / 1000);
                      if (sec < 5) return "Just now";
                      if (sec < 60) return `${sec} ${sec === 1 ? "second" : "seconds"} ago`;
                      const min = Math.floor(sec / 60);
                      if (min < 60) return `${min} ${min === 1 ? "minute" : "minutes"} ago`;
                      const hrs = Math.floor(min / 60);
                      if (hrs < 24) return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
                      const days = Math.floor(hrs / 24);
                      if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
                      const months = Math.floor(days / 30);
                      if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
                      const years = Math.floor(days / 365);
                      return `${years} ${years === 1 ? "year" : "years"} ago`;
                    })()}
                  </p>

                  <span className="mx-1">·</span>

                  {/* Privacy Icon */}
                  <span className="flex items-center gap-1 font-medium">
                    {feed.privacy === "PUBLIC" && (
                      <>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 118 2.5a5.5 5.5 0 010 11zM7.5 6h1v5h-1V6zm.5-1.5a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                        </svg>
                        Public
                      </>
                    )}
                    {feed.privacy === "PRIVATE" && (
                      <>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1a4 4 0 00-4 4v2H3v6h10V7h-1V5a4 4 0 00-4-4zM5.5 5a2.5 2.5 0 015 0v2h-5V5z" />
                        </svg>
                        Only Me
                      </>
                    )}

                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{feed.feed_title}</h2>

              <div
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none mb-3"
                dangerouslySetInnerHTML={{
                  __html: isExpanded ? feed.content : truncateHTMLContent(feed.content),
                }}
              />

              {getWordCount(feed.content) > 40 && (
                <button
                  onClick={() => toggleReadMode(feed.id)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}

              {feed.image && (
                <div className="mt-4 -mx-5">
                  <img
                    src={feed.image}
                    alt="Post"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Like & Comment Bar */}
            <div className="px-6 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">

              <div className="flex items-center gap-3">
                {feed.likes_count > 0 && (
                  <button
                    onClick={() => openLikedModal("People who liked this post", feed.liked_users?.map(lu => lu.user) || [])}
                    className="flex items-center gap-3 group"
                  >
                    {/* Avatar Stack */}
                    <div className="flex -space-x-3 relative">
                      {feed.liked_users?.slice(0, 5).map((lu, index) => {
                        const user = lu.user;
                        return (
                          <div
                            key={user.email}
                            className="relative hover:z-50 transition-transform hover:scale-125"
                            style={{ zIndex: 50 - index }}
                          >
                            {user.image ? (
                              <img
                                src={user.image.startsWith("http") ? user.image : `http://127.0.0.1:8000${user.image}`}
                                alt={user.first_name}
                                className="w-10 h-10 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-gray-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-400 border-4 border-white flex items-center justify-center shadow-md">
                                <User2 size={20} className="text-white" />
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* 9+ Badge */}
                      {feed.likes_count > 5 && (
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center border-4 border-white shadow-md z-10">
                          {feed.likes_count - 5}+
                        </div>
                      )}
                    </div>

                    {/* Reaction Count + Haha Icon */}
                    <span className="text-sm font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                      {/* Exact Haha SVG from your code */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" className="inline">
                        <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                        <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                        <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                        <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
                      </svg>
                      {feed.likes_count} {feed.likes_count === 1 ? "Reaction" : "Reactions"}
                    </span>
                  </button>
                )}
              </div>

              {/* Right: Comments & Shares */}
              <div className="flex items-center gap-6 text-sm">
                <p className="font-medium text-gray-700">
                  <span className="font-bold text-gray-900">{feed.comments.length}</span> Comment{feed.comments.length !== 1 && "s"}
                </p>
                <p className="font-medium text-gray-700">
                  <span className="font-bold text-gray-900">{feed.shares_count}</span> Share{feed.shares_count !== 1 && "s"}
                </p>
              </div>
            </div>

            {/* Bottom Reaction Buttons – With Active "Haha" State */}
            <div className="flex items-center justify-around py-4 border-t border-gray-100">
              {/* Haha Button (Active) */}
              <button
                onClick={() => toggleLike(feed.id)}
                className={`flex flex-col items-center gap-1.5 px-8 py-3 rounded-xl transition-all duration-200 ${feed.liked_by_user ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <span className="flex items-center gap-1">
                  {/* Same Haha SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 19 19">
                    <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                    <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                    <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                    <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
                  </svg>
                  <span className="text-xs font-medium">Haha</span>
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => toggleComments(feed.id)}
                className={`flex flex-col items-center gap-1.5 px-8 py-3 rounded-xl transition-all duration-200 ${showComments ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <span className="flex items-center gap-1">
                  {/* Same comment SVG */}
                  <svg class="_reaction_svg" xmlns="http://www.w3.org/2000/svg"
                    width="21" height="21" fill="none" viewBox="0 0 21 21">
                    <path stroke="#000"
                      d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                    <path stroke="#000" stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                  </svg>
                  <span className="text-xs font-medium">Comment</span>
                </span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center gap-1.5 px-8 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200">
                <span className="flex items-center gap-1">
                  {/* Same comment SVG */}
                  <svg class="_reaction_svg" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="21" fill="none" viewBox="0 0 24 21">
                    <path stroke="#000" stroke-linejoin="round"
                      d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                  </svg>
                  <span className="text-xs font-medium">Share</span>
                </span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="px-4 pb-4 mt-3">

                {/* View Previous Comments */}
                {feed.comments.length > 4 && (
                  <button className="text-sm text-blue-600 font-medium mb-2 hover:underline">
                    View {feed.comments.length - 4} previous comments
                  </button>
                )}

                {/* All Comments */}
                {feed.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 mb-4">

                    {/* User Image */}
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={comment.author.image || "/default_user.png"}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>

                    {/* Comment Box */}
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-xl px-3 py-2 shadow-sm">

                        {/* Name */}
                        <h4 className="font-semibold text-sm">
                          {comment.author.first_name} {comment.author.last_name}
                        </h4>

                        {/* Text */}
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>



                      {/* Like / Reply / Share / Time */}
                      <ul className="flex items-center gap-4 mt-1 text-xs font-medium text-gray-600">
                        <li
                          onClick={() => likeComment(feed.id, comment.id)}
                          className="cursor-pointer hover:underline"
                        >
                          Like
                        </li>

                        <li
                          onClick={() => toggleReplyInput(comment.id)}
                          className="cursor-pointer hover:underline"
                        >
                          Reply
                        </li>

                        <li
                          className="cursor-pointer hover:underline"
                        >
                          Share
                        </li>
                        <li className="text-gray-400">
                          {(() => {
                            const diffMs = Date.now() - new Date(comment.created_at).getTime();
                            const sec = Math.floor(diffMs / 1000);
                            if (sec < 5) return "Just now";
                            if (sec < 60) return `${sec} ${sec === 1 ? "second" : "seconds"} ago`;
                            const min = Math.floor(sec / 60);
                            if (min < 60) return `${min} ${min === 1 ? "minute" : "minutes"} ago`;
                            const hrs = Math.floor(min / 60);
                            if (hrs < 24) return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
                            const days = Math.floor(hrs / 24);
                            if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
                            const months = Math.floor(days / 30);
                            if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
                            const years = Math.floor(days / 365);
                            return `${years} ${years === 1 ? "year" : "years"} ago`;
                          })()}
                        </li>
                        <li>
                          {comment.likes_count > 0 && (
                            <button
                              onClick={() => openLikedModal("People who liked this comment", comment.liked_users?.map(lu => lu.user) || [])}
                              className="text-blue-600 hover:underline text-xs"
                            >
                              {/* Likes Counter */}
                              <div className="flex items-center gap-1 mt-1 ml-1 text-xs text-gray-500">
                                <button
                                  className="hover:text-blue-600"
                                >
                                  👍
                                </button>
                                <span>{comment.likes_count}</span>
                              </div>
                            </button>
                          )}
                        </li>
                      </ul>

                      {/* Reply Input Box */}
                      {replyOpen[comment.id] && (
                        <div className="flex gap-2 mt-3">

                          <img
                            src={feed.author.image}
                            className="w-8 h-8 rounded-full"
                            alt=""
                          />

                          <div className="flex-1 bg-gray-100 rounded-xl px-2 flex items-center">
                            <textarea
                              ref={(el) => (replyInputRefs.current[comment.id] = el)}
                              value={replyTexts[comment.id] || ""}
                              onChange={(e) =>
                                setReplyTexts({
                                  ...replyTexts,
                                  [comment.id]: e.target.value,
                                })
                              }
                              className="w-full outline-none bg-transparent p-2 resize-none text-sm"
                              placeholder="Write a reply..."
                            ></textarea>

                            <button
                              onClick={() => postReply(feed.id, comment.id)}
                              className="text-blue-600 font-semibold px-3"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}

                      {/* REPLIES */}
                      {comment.replies.length > 0 && (
                        <div className="mt-3 ml-6 space-y-3">

                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">

                              <img
                                src={reply.author.image}
                                className="w-8 h-8 rounded-full"
                                alt=""
                              />

                              <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2 shadow-sm">
                                <h4 className="font-semibold text-sm">
                                  {reply.author.first_name} {reply.author.last_name}
                                </h4>

                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {reply.content}
                                </p>

                                <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                                  <button
                                    onClick={() =>
                                      likeReply(feed.id, comment.id, reply.id)
                                    }
                                    className="hover:underline"
                                  >
                                    Like
                                  </button>
                                  <span className=" hover:underline">Share</span>
                                  {reply.likes_count > 0 && (
                                    <button
                                      onClick={() => openLikedModal("People who liked this reply", reply.liked_users?.map(lu => lu.user) || [])}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {reply.likes_count} {reply.likes_count === 1 ? "like" : "likes"}
                                    </button>
                                  )}
                                  <span className="text-gray-400">
                                    {(() => {
                                      const diffMs = Date.now() - new Date(reply.created_at).getTime();
                                      const sec = Math.floor(diffMs / 1000);
                                      if (sec < 5) return "Just now";
                                      if (sec < 60) return `${sec} ${sec === 1 ? "second" : "seconds"} ago`;
                                      const min = Math.floor(sec / 60);
                                      if (min < 60) return `${min} ${min === 1 ? "minute" : "minutes"} ago`;
                                      const hrs = Math.floor(min / 60);
                                      if (hrs < 24) return `${hrs} ${hrs === 1 ? "hour" : "hours"} ago`;
                                      const days = Math.floor(hrs / 24);
                                      if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
                                      const months = Math.floor(days / 30);
                                      if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
                                      const years = Math.floor(days / 365);
                                      return `${years} ${years === 1 ? "year" : "years"} ago`;
                                    })()}
                                  </span>
                                </div>

                              </div>

                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* WRITE A NEW COMMENT */}
                <div className="flex gap-3 mt-4">
                  <img
                    src={feed.author.image}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />

                  <div className="flex-1 bg-gray-100 rounded-xl shadow-sm flex items-center px-3">
                    <textarea
                      value={commentTexts[feed.id] || ""}
                      onChange={(e) =>
                        setCommentTexts({ ...commentTexts, [feed.id]: e.target.value })
                      }
                      className="w-full p-2 bg-transparent outline-none resize-none text-sm"
                      placeholder="Write a comment"
                    ></textarea>

                    <button
                      onClick={() => postComment(feed.id)}
                      className="text-blue-600 font-semibold px-3"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })}
      {/* Edit Post Modal */}
      {blankEditModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-screen overflow-y-auto relative">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">Edit Post</h2>
              <button
                onClick={() => setBlankEditModal({ open: false, feedId: null, feed: null })}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
              >
                <X size={28} />
              </button>
            </div>

            {/* Edit Form */}
            <EditFeed
              feedId={blankEditModal.feedId}
              feed={blankEditModal.feed}
              onClose={() => setBlankEditModal({ open: false, feedId: null, feed: null })}
              onSuccess={() => {
                window.location.reload(); 
              }}
            />
          </div>
        </div>
      )}
      {/* Liked Users Modal */}
      {likedUsersModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-bold">{likedUsersModal.title}</h3>
              <button onClick={closeLikedModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-5">
              {likedUsersModal.users.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No likes yet</p>
              ) : (
                <div className="space-y-4">
                  {likedUsersModal.users.map((u) => (
                    <div key={u.email} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full  overflow-hidden">
                        {u.image ? (
                          <img
                            src={u.image.startsWith("http") ? u.image : `http://127.0.0.1:8000${u.image}`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User2 className="w-full h-full p-2 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-sm text-gray-500">@{u.username || u.email.split("@")[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedList;