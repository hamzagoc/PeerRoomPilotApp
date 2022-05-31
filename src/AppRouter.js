import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import DashBoard from './Game/BoardGame/Dixit/pages/Dashboard';
import Loby from './Game/BoardGame/Dixit/pages/Loby';

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