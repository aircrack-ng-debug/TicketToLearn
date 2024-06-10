import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import MyPage from "./MyPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/my-page" element={<MyPage />} />
                </Route>
            </Routes>
        </Router>
    </React.StrictMode>
);
