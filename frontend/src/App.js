import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import FileUploadForm from "./components/FileUploadForm";
import UploadedFilesList from "./components/UploadedFilesList";
import "./App.css";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");

    if (!loggedInUser) {
      setLoggedIn(false);
      setUsername(null);
    }
    return () => {
      localStorage.removeItem("username");
    };
  }, []);

  const registerUser = async () => {
    try {
      await api.post("/register", { username, password });
      alert("User registered successfully");
    } catch (error) {
      alert("Registration failed");
    }
  };

  const loginUser = async () => {
    try {
      await api.post("/login", { username, password });
      localStorage.setItem("username", username);
      await fetchFiles(username); // Fetch files associated with the logged-in user
      alert("User logged in successfully");
      setLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  const fetchFiles = async (username) => {
    try {
      const response = await api.get(`/files/${username}`);
      setFiles(response.data); // Set the files retrieved from the server
    } catch (error) {
      alert("Failed to fetch files");
    }
  };

  const uploadFile = async () => {
    const loggedInUser = localStorage.getItem("username");
    if (!loggedInUser) {
      alert("Please log in to upload files");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", localStorage.getItem("username"));
    try {
      const response = await api.post("/upload", formData);
      await fetchFiles(localStorage.getItem("username")); // Fetch updated files after upload
      const uniqueCode = response.data;
      alert(`File uploaded successfully. Unique code: ${uniqueCode}`);
    } catch (error) {
      alert("File upload failed");
    }
  };

  const deleteFile = async (filename) => {
    try {
      await api.delete(`/files/${filename}`, {
        data: { username: localStorage.getItem("username") },
      });
      await fetchFiles(localStorage.getItem("username")); // Fetch updated files after deletion
      alert("File deleted successfully");
    } catch (error) {
      alert("Failed to delete file");
    }
  };

  const downloadFile = async (filename, code) => {
    try {
      const response = await api.get(`/download/${filename}/${code}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      alert("Failed to download file");
    }
  };

  return (
    <div className="container">
      <div className="screen">
        <h2 className="text-center text-white m-4">File management system</h2>
        <hr className="text-white"/>
        <div className="">
          <div className="p-4 rounded">
            {!loggedIn ? ( // Render login form if not logged in
              <LoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                registerUser={registerUser}
                loginUser={loginUser}
              />
            ) : (
              <div>
               <h4 className="text-white">Welcome, {username}!</h4>
               <hr className="text-white"/>
              </div>
            )}
          </div>
        </div>
        {loggedIn && ( // Render upload and file list components if logged in
          <div className="col">
            <div className="px-4 rounded">
              <FileUploadForm
                setSelectedFile={setSelectedFile}
                uploadFile={uploadFile}
              />
            </div>
            <hr className=" px-4 text-white"/>
            <div className="p-4 rounded">
              <UploadedFilesList
                files={files}
                deleteFile={deleteFile}
                downloadFile={downloadFile}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
