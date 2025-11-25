import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeedList from './FeedList';
import useUserProfile from '../useUserProfile'; // Make sure this hook works
import CreateFeed from './CreateFeed';


const FeedPage = () => {
    const { userData: user, loading: userLoading, error: userError } = useUserProfile();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userLoading) {
            setLoading(false);
        }
    }, [userLoading]);

    // Show loading while fetching user
    if (loading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your feed...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (userError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="p-8 text-center max-w-md">
                    <p className="text-red-600 font-medium mb-4">Session expired</p>
                    <p className="text-gray-600 mb-6">Please log in again.</p>
                    <Link to="/login">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Go to Login
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="_feed_inner_ppl_card _mar_b16  px-">
                <div className="_feed_inner_story_arrow">
                    <button type="button" className="_feed_inner_story_arrow_btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none"
                            viewBox="0 0 9 8">
                            <path fill="#fff"
                                d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                        </svg>
                    </button>
                </div>
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                        <div className="_feed_inner_profile_story _b_radious6 ">
                            <div className="_feed_inner_profile_story_image">
                                <img src="assets/card_ppl1.png" alt="Image"
                                    className="_profile_story_img" />
                                <div className="_feed_inner_story_txt">
                                    <div className="_feed_inner_story_btn">
                                        <button className="_feed_inner_story_btn_link">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10"
                                                height="10" fill="none" viewBox="0 0 10 10">
                                                <path stroke="#fff" stroke-linecap="round"
                                                    d="M.5 4.884h9M4.884 9.5v-9" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="_feed_inner_story_para">Your Story</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                        <div className="_feed_inner_public_story _b_radious6">
                            <div className="_feed_inner_public_story_image">
                                <img src="assets/card_ppl2.png" alt="Image"
                                    className="_public_story_img" />
                                <div className="_feed_inner_pulic_story_txt">
                                    <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                </div>
                                <div className="_feed_inner_public_mini">
                                    <img src="assets/mini_pic.png" alt="Image"
                                        className="_public_mini_img" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
                        <div className="_feed_inner_public_story _b_radious6">
                            <div className="_feed_inner_public_story_image">
                                <img src="assets/card_ppl3.png" alt="Image"
                                    className="_public_story_img" />
                                <div className="_feed_inner_pulic_story_txt">
                                    <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                </div>
                                <div className="_feed_inner_public_mini">
                                    <img src="assets/mini_pic.png" alt="Image"
                                        className="_public_mini_img" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
                        <div className="_feed_inner_public_story _b_radious6">
                            <div className="_feed_inner_public_story_image">
                                <img src="assets/card_ppl4.png" alt="Image"
                                    className="_public_story_img" />
                                <div className="_feed_inner_pulic_story_txt">
                                    <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                </div>
                                <div className="_feed_inner_public_mini">
                                    <img src="assets/mini_pic.png" alt="Image"
                                        className="_public_mini_img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="_feed_inner_ppl_card_mobile _mar_b16">
                <div className="_feed_inner_ppl_card_area">
                    <ul className="_feed_inner_ppl_card_area_list">
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story">
                                    <img src="/assets/mobile_story_img.png" alt="Image"
                                        className="_card_story_img" />
                                    <div className="_feed_inner_ppl_btn">
                                        <button className="_feed_inner_ppl_btn_link" type="button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12"
                                                height="12" fill="none" viewBox="0 0 12 12">
                                                <path stroke="#fff" stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 2.5v7M2.5 6h7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story_active">
                                    <img src="/assets/mobile_story_img1.png" alt="Image"
                                        className="_card_story_img1" />
                                </div>
                                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story_inactive">
                                    <img src="/assets/mobile_story_img2.png" alt="Image"
                                        className="_card_story_img1" />
                                </div>
                                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <a href="#0" className="_feed_inner_ppl_card_area_link">
                                    <div className="_feed_inner_ppl_card_area_story_active">
                                        <img src="/assets/mobile_story_img1.png"
                                            alt="Image" className="_card_story_img1" />
                                    </div>
                                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                </a>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story_inactive">
                                    <img src="/assets/mobile_story_img2.png" alt="Image"
                                        className="_card_story_img1" />
                                </div>
                                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <a href="#0" className="_feed_inner_ppl_card_area_link">
                                    <div className="_feed_inner_ppl_card_area_story_active">
                                        <img src="/assets/mobile_story_img1.png"
                                            alt="Image" className="_card_story_img1" />
                                    </div>
                                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                </a>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story">
                                    <img src="/assets/mobile_story_img.png" alt="Image"
                                        className="_card_story_img" />
                                </div>
                                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                            </a>
                        </li>
                        <li className="_feed_inner_ppl_card_area_item">
                            <a href="#0" className="_feed_inner_ppl_card_area_link">
                                <div className="_feed_inner_ppl_card_area_story_active">
                                    <img src="/assets/mobile_story_img1.png" alt="Image"
                                        className="_card_story_img1" />
                                </div>
                                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <CreateFeed />
            {/* Feed Posts */}
            <div className="max-w-4xl mx-auto mt-6 px-4 pb-10">
                <FeedList />
            </div>
        </div>
    );
};

export default FeedPage;