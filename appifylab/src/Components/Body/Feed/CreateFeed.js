import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RichTextEditor from '../tinymce/tiny';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState('PUBLIC');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const access_token = localStorage.getItem('access_token');
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!access_token) {
            navigate('/login');
        }
    }, [access_token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setErrorMessage('Please write something in your post.');
            return;
        }

        if (!image && content.length < 10) {
            setErrorMessage('Add an image or write a longer post.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        if (image) formData.append('image', image);
        formData.append('content', content);
        formData.append('privacy', privacy);

        try {
            await axios.post(
                'http://127.0.0.1:8000/apiv1/user/feeds/',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            setSuccessMessage('Post created successfully!');
            setContent('');
            setImage(null);
            setPrivacy('PUBLIC');

            // Redirect after success
            setTimeout(() => {
                navigate('/feed');
            }, 1500);

        } catch (error) {
            console.error('Error creating post:', error.response?.data || error);
            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.content?.[0] ||
                'Failed to create post. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!access_token) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h1 className="text-3xl font-bold text-center">Create New Post</h1>
                        <p className="text-center mt-2 opacity-90">Share your thoughts with the world</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Privacy Selector */}
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-4 bg-gray-50 rounded-full p-2 shadow-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="privacy"
                                            value="PUBLIC"
                                            checked={privacy === 'PUBLIC'}
                                            onChange={(e) => setPrivacy(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="flex items-center gap-1.5 text-sm font-medium">
                                            Public
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="privacy"
                                            value="PRIVATE"
                                            checked={privacy === 'PRIVATE'}
                                            onChange={(e) => setPrivacy(e.target.value)}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        <span className="flex items-center gap-1.5 text-sm font-medium">
                                            Only Me
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Rich Text Editor */}
                            <div>
                                <label className="block text-lg font-semibold text-gray-800 mb-3">
                                    What's on your mind?
                                </label>
                                <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-inner">
                                    <RichTextEditor value={content} onChange={setContent} />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-lg font-semibold text-gray-800 mb-3">
                                    Add a Photo (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        {image ? (
                                            <div className="space-y-3">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Preview"
                                                    className="mx-auto max-h-64 rounded-xl shadow-lg"
                                                />
                                                <p className="text-green-600 font-medium">
                                                    {image.name}
                                                </p>
                                                <p className="text-sm text-blue-600">Click to change</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <svg className="mx-auto w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-gray-600 font-medium">Click to upload an image</p>
                                                <p className="text-sm text-gray-500">JPG, PNG, GIF up to 10MB</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pt-6">
                                <button
                                    type="submit"
                                    disabled={loading || !content.trim()}
                                    className={`px-3 py-3 rounded-full font-bold text-white text-lg shadow-lg transition-all transform hover:scale-105 ${loading || !content.trim()
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Posting...
                                        </span>
                                    ) : (
                                        'Post to Feed'
                                    )}
                                </button>
                            </div>

                            {/* Messages */}
                            {successMessage && (
                                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center font-medium">
                                    {successMessage}
                                </div>
                            )}
                            {errorMessage && (
                                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center font-medium">
                                    {errorMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;