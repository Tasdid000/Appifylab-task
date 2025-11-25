import React, { useState, useEffect } from "react";
import axios from "axios";
import useUserProfile from "../userprofilehookup";

const EditFeed = ({ feedId: propFeedId, feed: propFeed, onClose, onSuccess }) => {
  const { userData, loading: userLoading } = useUserProfile();
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");

  // Use props if provided (modal mode), otherwise fallback to fetch
  useEffect(() => {
    if (propFeed && propFeedId) {
      setFeed(propFeed);
      setLoading(false);
    } else if (propFeedId) {
      // Optional: fetch if only ID is passed
      const fetchFeed = async () => {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/apiv1/user/feeds/${propFeedId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFeed(res.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to load feed.");
          setLoading(false);
        }
      };
      fetchFeed();
    }
  }, [propFeedId, propFeed, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feed) return;

    try {
      const formData = new FormData();
      formData.append("content", feed.content);
      formData.append("privacy", feed.privacy || "PUBLIC");
      if (feed.image instanceof File) {
        formData.append("image", feed.image);
      }

      await axios.put(
        `http://127.0.0.1:8000/apiv1/user/feeds/${propFeedId || feed.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success callback
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      alert("Failed to update post!");
      console.error(err);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center py-8">{error}</p>;
  }

  if (!feed) return null;

  return (
    <div className="p-6 space-y-6 overflow-y-auto max-h-96">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={feed.content || ""}
            onChange={(e) => setFeed({ ...feed, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Write your post..."
          />
        </div>

        {/* Privacy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
          <select
            value={feed.privacy || "PUBLIC"}
            onChange={(e) => setFeed({ ...feed, privacy: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Only Me</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && setFeed({ ...feed, image: e.target.files[0] })}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {feed.image && typeof feed.image === "string" && (
            <div className="mt-3">
              <img src={feed.image} alt="Current" className="w-full max-h-64 object-cover rounded-xl" />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFeed;