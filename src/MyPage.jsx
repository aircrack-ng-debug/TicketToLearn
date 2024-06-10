import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Section from "./components/Section.jsx";

function MyPage() {
    const [myPageData, setMyPageData] = useState({ name: '', email: '', course: '' });
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    useEffect(() => {
        const fetchMyPageData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:3001/my-page', {
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post('http://localhost:3001/file-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setUploadStatus('File uploaded successfully');
        } catch (error) {
            setUploadStatus('Error uploading file');
            console.error('Error uploading file', error);
        }
    };

    return (
        <Section id="my-page" className="flex flex-col min-h-screen pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            <div className="container mx-auto p-4">
                <h1>My Page</h1>
                <p>Name: {myPageData.name}</p>
                <p>Email: {myPageData.email}</p>
                <p>Course: {myPageData.course}</p>

                <form onSubmit={handleFileUpload}>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit">Upload File</button>
                </form>
                {uploadStatus && <p>{uploadStatus}</p>}
            </div>
            <Footer />
        </Section>
    );
}

export default MyPage;
