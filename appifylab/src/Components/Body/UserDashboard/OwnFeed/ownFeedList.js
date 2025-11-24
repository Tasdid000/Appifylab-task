import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserProfile from "../userprofilehookup";
import { FaLock, FaGlobe, FaHeart, FaEdit, FaTrash } from "react-icons/fa";

const FeedList = () => {
  const navigate = useNavigate();
  const { userData, loading: userLoading, error: userError } = useUserProfile();

  const [feeds, setFeeds] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserFeeds = async () => {
      try {
        if (!userData) return;

        const accessToken = localStorage.getItem("access_token");

        const response = await axios.get(
          "http://127.0.0.1:8000/apiv1/user/feeds/",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const userFeeds = response.data.filter(
          (feed) => feed.author.email === userData.data.email
        );

        setFeeds(userFeeds);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingFeeds(false);
      }
    };

    if (!userLoading && userData) fetchUserFeeds();
  }, [userData, userLoading]);

  if (userLoading) return <p className="text-center mt-10">Loading user...</p>;
  if (userError) return <p className="text-center text-red-500">Unauthorized</p>;
  if (loadingFeeds) return <p className="text-center mt-10">Loading feeds...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  const handleEdit = (id) => navigate(`/dashboard/edit-feed/${id}`);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feed?");
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/apiv1/user/feeds/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Remove the deleted feed from state
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== id));
    } catch (err) {
      alert("Failed to delete feed. Try again.");
      console.error(err);
    }
  };

  const truncateHTMLContent = (htmlContent, wordLimit = 40) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const words = plainText.split(' ').slice(0, wordLimit).join(' ');
    return words + '...';
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Feed List</h2>

      {feeds.length === 0 ? (
        <p className="text-gray-600">You haven't posted any feeds yet.</p>
      ) : (
        <ul className="space-y-5">
          {feeds.map((feed) => (
            <li
              key={feed.id}
              className="w-full bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {feed.feed_title}
                </h3>

                <div className="flex items-center gap-3">
                  {/* Privacy */}
                  {feed.privacy.toLowerCase() === "private" ? (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <FaLock /> Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-indigo-600 font-medium">
                      <FaGlobe /> Public
                    </span>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => handleEdit(feed.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    <FaEdit /> Edit
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(feed.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: truncateHTMLContent(feed.content) }} />

              <div className="flex flex-wrap items-center justify-between border-t pt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaHeart className="text-red-500" />
                  {feed.likes_count} likes
                </div>
                <div>
                  <span className="font-medium">Posted:</span>{" "}
                  {new Date(feed.created_at).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedList;
