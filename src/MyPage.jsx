import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Section from "./components/Section.jsx";

function MyPage() {
    const [myPageData, setMyPageData] = useState({ name: '', email: '', course: '' });

    useEffect(() => {
        const fetchMyPageData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/my-page', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMyPageData(response.data);
            } catch (error) {
                console.error('Error fetching my page data', error);
            }
        };

        fetchMyPageData();
    }, []);

    return (
        <Section id="my-page" className="flex flex-col min-h-screen pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            <div className="container mx-auto p-4">
                <h1>My Page</h1>
                <p>Name: {myPageData.name}</p>
                <p>Email: {myPageData.email}</p>
                <p>Course: {myPageData.course}</p>
            </div>
            <Footer />
        </Section>
    );
}

export default MyPage;
