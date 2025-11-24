import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User2,
  ThumbsUp,
  MessageCircle,
  Calendar,
  X,
} from "lucide-react";
import useUserProfile from "../useUserProfile";

const FeedList = () => {
  const { loading: userLoading } = useUserProfile();
  const [feeds, setFeeds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [commentTexts, setCommentTexts] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [expandedFeeds, setExpandedFeeds] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [likedUsersModal, setLikedUsersModal] = useState({
    open: false,
    title: "",
    users: [],
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

  // GET WORD COUNT SAFELY
  const getWordCount = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return (div.textContent || div.innerText || "").trim().split(/\s+/).length;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {errorMessage && <p className="text-red-600 text-center">{errorMessage}</p>}

      {feeds.map((feed) => {
        const isExpanded = expandedFeeds[feed.id];
        const showComments = commentsVisible[feed.id];

        return (
          <div
            key={feed.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
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
                    {new Date(feed.created_at).toLocaleString()}

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
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => toggleLike(feed.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition ${feed.liked_by_user ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  <ThumbsUp size={20} className={feed.liked_by_user ? "fill-current" : ""} />
                  Like
                </button>

                <button
                  onClick={() => toggleComments(feed.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition ${showComments ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  <MessageCircle size={20} className={showComments ? "fill-current" : ""} />
                  Comment
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {feed.likes_count > 0 && (
                  <button
                    onClick={() =>
                      openLikedModal(
                        "People who liked this post",
                        feed.liked_users?.map((lu) => lu.user) || []
                      )
                    }
                    className="text-blue-600 hover:underline mr-4"
                  >
                    {feed.likes_count} {feed.likes_count === 1 ? "Like" : "Likes"}
                  </button>
                )}
                {feed.comments.length > 0 && (
                  <span>{feed.comments.length} Comments</span>
                )}
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="border-t border-gray-100">
                {feed.comments.map((c) => (
                  <div key={c.id} className="border-b border-gray-100 last:border-b-0">
                    <div className="p-4 bg-gray-50">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {c.author.image ? (
                            <img src={c.author.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User2 className="w-full h-full p-1 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {c.author.first_name} {c.author.last_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(c.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-gray-800 mb-2">{c.content}</p>

                          <div className="flex items-center gap-6 text-sm">
                            <button
                              onClick={() => likeComment(feed.id, c.id)}
                              className={c.liked_by_user ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"}
                            >
                              Like {c.likes_count > 0 && `(${c.likes_count})`}
                            </button>

                            {/* Who liked the comment */}
                            {c.likes_count > 0 && (
                              <button
                                onClick={() =>
                                  openLikedModal(
                                    "People who liked this comment",
                                    c.liked_users?.map((lu) => lu.user) || []
                                  )
                                }
                                className="text-blue-600 hover:underline text-xs"
                              >
                                {c.likes_count} {c.likes_count === 1 ? "person" : "people"} liked
                              </button>
                            )}

                            <button
                              onClick={() => toggleReplyInput(c.id)}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              Reply
                            </button>
                          </div>

                          {/* Reply Input */}
                          {replyOpen[c.id] && (
                            <div className="flex gap-2 mt-3">
                              <input
                                ref={(el) => (replyInputRefs.current[c.id] = el)}
                                type="text"
                                value={replyTexts[c.id] || ""}
                                onChange={(e) =>
                                  setReplyTexts((p) => ({ ...p, [c.id]: e.target.value }))
                                }
                                onKeyDown={(e) => e.key === "Enter" && postReply(feed.id, c.id)}
                                placeholder="Write a reply..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => postReply(feed.id, c.id)}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Send
                              </button>
                            </div>
                          )}

                          {/* Replies */}
                          {c.replies?.map((r) => (
                            <div key={r.id} className="mt-4 ml-12 flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                {r.author.image ? (
                                  <img
                                    src={
                                      r.author.image.startsWith("http")
                                        ? r.author.image
                                        : `http://127.0.0.1:8000${r.author.image}`
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User2 className="w-full h-full p-1 text-gray-400" />
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {r.author.first_name} {r.author.last_name}
                                  </span>
                                </div>
                                <p className="text-gray-800 text-sm">{r.content}</p>

                                <div className="flex items-center gap-4 mt-1 text-xs">
                                  <button
                                    onClick={() => likeReply(feed.id, c.id, r.id)}
                                    className={r.liked_by_user ? "text-blue-600 font-medium" : "text-gray-600"}
                                  >
                                    Like {r.likes_count > 0 && `(${r.likes_count})`}
                                  </button>

                                  {/* Who liked the reply */}
                                  {r.likes_count > 0 && (
                                    <button
                                      onClick={() =>
                                        openLikedModal(
                                          "People who liked this reply",
                                          r.liked_users?.map((lu) => lu.user) || []
                                        )
                                      }
                                      className="text-blue-600 hover:underline"
                                    >
                                      {r.likes_count} {r.likes_count === 1 ? "like" : "likes"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* New Comment */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={commentTexts[feed.id] || ""}
                      onChange={(e) =>
                        setCommentTexts((p) => ({ ...p, [feed.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && postComment(feed.id)}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => postComment(feed.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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

      {/* Liked Users Modal */}
      {likedUsersModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
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
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
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