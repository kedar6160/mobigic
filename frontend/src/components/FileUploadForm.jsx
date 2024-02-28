import React from "react";
import "../styles/FileUploadForm.css";

const FileUploadForm = ({ setSelectedFile, uploadFile }) => (
  <>
    <h5 className="text-white">Upload File</h5>
    <div className="d-flex bg-white px-3 py-2 rounded align-items-center justify-content-between">
    <input
      type="file"
      onChange={(e) => setSelectedFile(e.target.files[0])}
      className="form-control-file"
    />
    <button onClick={uploadFile} className="btn btn-success border border-dark">Upload File</button>
    </div>
  </>
);

export default FileUploadForm;
