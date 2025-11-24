import React from 'react';
import LoginPage from './Body/login and registration/login';

const Main = () => {

    return (
        <div>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </div>
    );
};

export default Main;