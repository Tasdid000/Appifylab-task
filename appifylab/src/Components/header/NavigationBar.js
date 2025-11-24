import { Popover } from '@headlessui/react';
import useUserProfile from '../Body/useUserProfile';
import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
    const navigate = useNavigate();
    const { userData, loading, clearUserData } = useUserProfile();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        clearUserData();
        navigate("/");
    };

    return (
        <header className="bg-white">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link className="flex items-center justify-center text-blue-500 hover:text-blue-500" to="/">
                        <img src="/assets/logo.svg" alt="AppifyLab Logo" className="h-8 w-auto" />
                    </Link>
                </div>

                {/* User Profile or Log in */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {loading ? (
                        <p className="text-sm text-gray-900">Loading...</p>
                    ) : userData ? (                      
                        <Popover className="relative">
                            <Popover.Button className="flex items-center space-x-3 focus:outline-none">
                                <img
                                    src={`http://127.0.0.1:8000${userData.data.image}`}
                                    alt="User Profile"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </Popover.Button>

                            <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-gray-50 shadow-lg ring-1 ring-gray-900/5 font-semibold">
                                <div className="p-2">
                                    <Link to="/dashboard/userprofile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500 hover:rounded-lg">
                                        Dashboard
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-500 hover:rounded-lg"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </Popover.Panel>
                        </Popover>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-500">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </Link>
                    )}

                </div>
            </nav>
        </header>
    );
}