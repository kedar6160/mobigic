import React from "react";
import "../styles/UploadedFilesList.css";

const UploadedFilesList = ({ files, deleteFile, downloadFile }) => (
  <>
    <h5 className="text-white">Uploaded Files</h5>
    <ul className="list-group">
      {files.map((file, index) => (
        <li
          key={index}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          {file.filename}
          <div className="d-flex gap-1" >
            <button
              onClick={() => deleteFile(file.filename)}
              className="btn btn-danger btn-block border border-dark"
            >
              Delete
            </button>
            <button
              onClick={() => {
                const code = prompt("Enter the 6 digit code for the file:");
                downloadFile(file.filename, code);
              }}
              className="btn btn-primary btn-block border border-dark"
            >
              Download
            </button>
          </div>
        </li>
      ))}
    </ul>
  </>
);

export default UploadedFilesList;
