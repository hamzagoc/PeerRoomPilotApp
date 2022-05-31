import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import DashBoard from './app/pages/Dashboard';
import Loby from './app/pages/Loby';

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashBoard />} />
                <Route path="loby" element={<Loby />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;