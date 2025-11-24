import { Link } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegHeart, FaRegFileAlt, FaUserCircle } from "react-icons/fa";
import useUserProfile from "./useUserProfile";
import FeedPage from "./Feed/Feed";

const Home = () => {
    const { userData, loading, error } = useUserProfile();
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!userData) return;
            try {
                setStatsLoading(true);
                const token = localStorage.getItem("access_token");
                const response = await axios.get(
                    "http://127.0.0.1:8000/apiv1/user/feeds/my-stats/",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStats(response.data);
            } catch (err) {
                console.error(err);
                setStatsError("Failed to load stats");
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, [userData]);

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">

            {/* Profile */}
            <div className="w-full md:w-[25%] flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center">
                    {loading && <p className="text-gray-500 text-lg">Loading profile...</p>}
                    {error && <p className="text-red-500 text-lg">{error}</p>}

                    {userData && (
                        <>
                            <div className="relative w-32 h-32">
                                <img
                                    src={userData.data.image ? `http://127.0.0.1:8000${userData.data.image}` : undefined}
                                    alt="User"
                                    className="rounded-full border-4 border-white shadow-md w-full h-full object-cover bg-gray-200"
                                />
                                {!userData.data.image && (
                                    <FaUserCircle className="absolute top-0 left-0 w-full h-full text-gray-300" />
                                )}
                            </div>

                            <h2 className="mt-4 text-xl font-bold text-gray-800">{userData.data.first_name} {userData.data.last_name}</h2>
                            <p className="text-gray-500 text-sm">{userData.data.email}</p>

                            <Link to="/dashboard/userprofile">
                                <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 font-medium">
                                    View Profile
                                </button>
                            </Link>

                            <hr className="my-6 border-gray-300 w-full" />

                            {/* Stats Cards section*/}
                            {statsLoading && <p className="text-gray-500 text-sm">Loading stats...</p>}
                            {statsError && <p className="text-red-500 text-sm">{statsError}</p>}
                            {stats && (
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                                        <FaRegFileAlt className="text-blue-500 text-2xl" />
                                        <p className="mt-2 text-gray-800 font-semibold">{stats.total_posts}</p>
                                        <p className="text-gray-500 text-sm">Posts</p>
                                    </div>
                                    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                                        <FaRegHeart className="text-red-500 text-2xl" />
                                        <p className="mt-2 text-gray-800 font-semibold">{stats.total_likes}</p>
                                        <p className="text-gray-500 text-sm">Likes</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Feed section */}
            <aside className="w-full md:w-[75%] flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <FeedPage />
                </div>
            </aside>
        </div>
    );
};

export default Home;
