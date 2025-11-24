import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import useUserProfile from "../userprofilehookup";
import RichTextEditor from "../../tinymce/tiny";

const EditFeed = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { userData, loading: userLoading, error: userError } = useUserProfile();

    const [feed, setFeed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("access_token");

    // Fetch feed data
    useEffect(() => {
        const fetchFeed = async () => {
            try {
                if (!userData) return;

                const res = await axios.get(`http://127.0.0.1:8000/apiv1/user/feeds/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.author.email !== userData.data.email) {
                    setError("You are not authorized to edit this feed.");
                    setLoading(false);
                    return;
                }

                setFeed(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load feed.");
                setLoading(false);
            }
        };

        if (!userLoading && userData) fetchFeed();
    }, [id, userData, userLoading, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("content", feed.content);
            formData.append("privacy", feed.privacy);
            if (feed.image instanceof File) formData.append("image", feed.image);

            await axios.put(`http://127.0.0.1:8000/apiv1/user/feeds/${id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/dashboard/own-feed");
        } catch (err) {
            alert("Failed to update feed!");
        }
    };

    if (userLoading || loading)
        return (
            <div className="w-full flex justify-center mt-20">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );

    if (error || userError)
        return (
            <div className="text-center py-10 text-red-600 font-semibold">
                {error || userError?.message}
            </div>
        );

    return (
        <div className="mx-auto mt-10">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Edit Feed</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                >
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-10">
                {/* Content */}
                <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                        Content
                    </label>
                    <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
                        <RichTextEditor
                            value={feed.content}
                            onChange={(content) => setFeed({ ...feed, content })}
                        />
                    </div>
                </div>

                {/* Privacy */}
                <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                        Privacy
                    </label>
                    <select
                        name="privacy"
                        value={feed.privacy}
                        onChange={(e) => setFeed({ ...feed, privacy: e.target.value })}
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                        Image
                    </label>

                    <input
                        type="file"
                        onChange={(e) =>
                            setFeed({ ...feed, image: e.target.files[0] })
                        }
                        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100 cursor-pointer"
                    />

                    {/* Image Preview */}
                    {feed.image && !(feed.image instanceof File) && (
                        <div className="mt-4">
                            <div className="border rounded-xl overflow-hidden shadow-sm w-60">
                                <img
                                    src={feed.image}
                                    alt="Preview"
                                    className="w-full h-40 object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-normal p-3 rounded-xl shadow-md transition"
                >
                    Update Feed
                </button>
            </form>
        </div>
    );
};

export default EditFeed;
