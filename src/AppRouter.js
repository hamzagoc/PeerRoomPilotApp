import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import DashBoard from './app/common/pages/Dashboard';
import NotFoundPage from './app/common/pages/NotFoundPage';
import DixitGame from './app/Dixit/pages/DixitGame';

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashBoard />} />
                <Route path="dixit/:roomname" element={<DixitGame />} />
                <Route path="dixit" element={<DixitGame />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;