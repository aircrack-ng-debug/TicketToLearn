import React, { useEffect, useState } from 'react';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Section from "./components/Section.jsx";
import axios from "axios";

function MyPage() {
    const [myPageData, setMyPageData] = useState({ name: '', email: '', course: '', isAdmin: false, files: [], notes: '' });
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [latexImage, setLatexImage] = useState('');
    const [time, setTime] = useState('');

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
                setNotes(response.data.notes);
            } catch (error) {
                console.error('Error fetching my page data', error);
            }
        };

        fetchMyPageData();

        const fetchTime = async () => {
            try {
                const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
                const data = await response.json();
                setTime(new Date(data.datetime).toLocaleTimeString());
            } catch (error) {
                console.error('Error fetching time:', error);
            }
        };

        fetchTime();
        const interval = setInterval(fetchTime, 1000);

        return () => clearInterval(interval);
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

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const saveNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/save-notes', { notes }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error saving notes', error);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveNotes();
        }, 1000); // Save notes automatically every second

        return () => clearTimeout(timeoutId);
    }, [notes]);

    const convertToLatex = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Sending request to convert-latex:', { text: notes });
            const response = await axios.post('http://localhost:3001/convert-latex', { text: notes }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Received response from convert-latex:', response.data);
            setLatexImage(response.data.imageUrl);
        } catch (error) {
            console.error('Error converting text to LaTeX', error);
            if (error.response) {
                console.log('Response data:', error.response.data);
            }
        }
    };


    return (
        <Section id="my-page" className="flex flex-col min-h-screen pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
            <Header />
            <div className="container mx-auto p-4 flex-grow">
                <div className="shadow-md rounded-lg p-6">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold mb-4">My Page</h1>
                        <p>current time {time}</p>
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
                                className="border border-gray-300 p-2 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Upload File
                        </button>
                    </form>
                    {uploadStatus && <p className="text-red-500">{uploadStatus}</p>}

                    <h2 className="text-xl font-semibold mb-4">Files</h2>
                    <ul className="list-disc list-inside mb-6">
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

                    <h2 className="text-xl font-semibold mb-4">Notes</h2>
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        className="w-full h-64 p-2 border border-gray-300 rounded-md mb-4 shadow-white-md"
                        placeholder="Write your notes here..."
                    ></textarea>
                    <button
                        onClick={convertToLatex}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Convert to LaTeX
                    </button>
                    {latexImage && (
                        <div className="mt-4">
                            <img src={latexImage} alt="LaTeX Output" className="border border-gray-300 rounded-md" />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </Section>
    );
}

export default MyPage;
