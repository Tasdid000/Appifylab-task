import React, { useState } from 'react';
import axios from 'axios';

const UserProfileCard = ({ userData }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    try {
      if (!selectedImage) {
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedImage);

      await axios.put(
        `http://127.0.0.1:8000/apiv1/user/update_profile/${userData.data.email}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-blue-400 to-blue-700 shadow-sm rounded-lg overflow-hidden">
      <div className="relative h-32">
        {/* Profile image */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-32 h-32">
          <img
            src={`http://127.0.0.1:8000${userData.data.image}`}
            alt='User'
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
        </div>

      </div>

      <div className="text-center mt-20 p-4 space-y-4">
        {/* Upload New Image */}
        <div className="flex justify-center items-center space-x-4">
          <label className="bg-blue-600 text-gray-50 px-4 py-2 rounded-lg cursor-pointer border-2 border-blue-700 hover:bg-gray-50 hover:text-blue-700 delay-150">
            Upload New
            <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
          </label>

          {/* Save Button */}
          <button
            onClick={handleUploadImage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
