import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Section from "./components/Section.jsx";

import {login} from "./constants/index.js";
import {curve} from "./assets/index.js";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/login', {email, password});
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Section id="login" className="flex flex-col min-h-screen pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header/>
            <div className="flex flex-col flex-grow pt-[4.75rem] login-container">

                <h1 className="flex h1 mb-10 items-center justify-center">
                    {` `}
                    <span className="inline-block relative">
                        Login{" "}
                        <img
                            src={curve}
                            className="absolute top-full left-0 w-full xl:-mt-2"
                            width={624}
                            height={28}
                            alt="Curve"
                        />
                    </span>
                </h1>

                <div className="flex items-center justify-center min-h-[34rem] flex-wrap gap-10 mb-10">
                    {login.map((item) => (
                        <div
                            className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                            style={{
                                backgroundImage: `url(${item.backgroundUrl})`,
                            }}
                            key={item.id}
                        >
                            <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                                <h5 className="h5 mb-5">{item.title}</h5>

                                <div className="space-y-4">
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter Email"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter Password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onClick={handleSubmit}
                                    >
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Footer/>
            </div>
        </Section>
    );
}

export default Login;
