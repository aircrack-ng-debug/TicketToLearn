import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Section from "./components/Section.jsx";

function MyPage() {
    const [myPageData, setMyPageData] = useState({ name: '', email: '', course: '', isAdmin: false, files: [] });
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    useEffect(() => {
        const fetchMyPageData = async () => {
            try {
                const token = localStorage.getItem('token');
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
            const uploadEndpoint = myPageData.isAdmin ? 'http://localhost:3001/admin-upload' : 'http://localhost:3001/file-upload';
            const response = await axios.post(uploadEndpoint, formData, {
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
            <div className="container mx-auto p-4 flex-grow">
                <div className="shadow-md rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold mb-4">My Page</h1>
                        <p className="mb-2"><strong>Name:</strong> {myPageData.name}</p>
                        <p className="mb-2"><strong>Email:</strong> {myPageData.email}</p>
                        <p className="mb-2"><strong>Course:</strong> {myPageData.course}</p>
                        <p className="mb-4"><strong>Admin Status:</strong> {myPageData.isAdmin ? 'Admin' : 'User'}</p>
                    </div>


                    <form onSubmit={handleFileUpload} className="mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="border border-gray-300 p-2 rounded-md "
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex flex-col items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Upload File
                        </button>
                    </form>
                    {uploadStatus && <p className="text-red-500">{uploadStatus}</p>}

                    <h2 className="text-xl font-semibold mb-4">Files</h2>
                    <ul className="list-disc list-inside">
                        {myPageData.files.map((file, index) => (
                            <li key={index}>
                                <a
                                    href={`http://localhost:3001/uploads/${file.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {file.originalname}
                                </a> (Uploaded by: {file.uploadedBy})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </Section>
    );
}

export default MyPage;
