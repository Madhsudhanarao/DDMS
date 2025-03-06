import React, { useState, useRef } from "react";
import { Upload, Download, Share, PenTool, LogIn, LogOut, Cloud, Trash2, Home, Mail, X } from "lucide-react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";

const Button = ({ children, onClick, variant = "solid" }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        variant === "outline" ? "border border-gray-600 text-gray-600" : "bg-blue-600 text-white"
      }`}
    >
      {children}
    </button>
  );
  
  const Card = ({ children }) => (
    <div className="border p-4 rounded-lg shadow">{children}</div>
  );
  
  const CardContent = ({ children }) => <div className="p-2">{children}</div>;
  

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [signature, setSignature] = useState(null);
  const [penColor, setPenColor] = useState("black");
  const [typedSignature, setTypedSignature] = useState("");
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const sigCanvas = useRef(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadProgress(30);
      setTimeout(() => {
        setDocuments([...documents, file]);
        setUploadProgress(100);
      }, 1000);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadProgress(30);
      setTimeout(() => {
        setDocuments([...documents, ...acceptedFiles]);
        setUploadProgress(100);
      }, 1000);
    },
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDocuments([]);
  };

  const saveSignature = () => {
    setSignature(sigCanvas.current.toDataURL());
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignature(null);
    setTypedSignature("");
    setUploadedSignature(null);
  };

  const handleDelete = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedSignature(URL.createObjectURL(e.target.files[0]));
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col min-h-screen">
      <header className="flex justify-between items-center py-4 border-b mb-6">
        <h1 className="text-2xl font-bold">Digital Document Management System</h1>
        <nav className="flex gap-4">
          <Button variant="outline"><Home className="mr-2" /> Home</Button>
          <Button variant="outline"><Mail className="mr-2" /> Contact</Button>
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2" /> Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              <LogIn className="mr-2" /> Login
            </Button>
          )}
        </nav>
      </header>

      <main className="flex-grow">
        {isAuthenticated && (
          <>
            <div {...getRootProps()} className="border-dashed border-2 p-6 text-center cursor-pointer mb-4 rounded-lg hover:bg-gray-100 transition">
              <input {...getInputProps()} />
              <p>Drag & Drop documents here or click to select files</p>
            </div>
            <div className="flex gap-4 mb-6">
              <input type="file" id="upload" className="hidden" onChange={handleUpload} />
              <label htmlFor="upload">
                <Button>
                  <Upload className="mr-2" /> Upload Document
                </Button>
              </label>
              <Button variant="outline">
                <Cloud className="mr-2" /> Upload from Cloud
              </Button>
            </div>
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}

            {/* Signature Section */}
            <Card className="mt-6 p-4">
              <h2 className="text-lg font-bold mb-2">Digital Signature</h2>
              <SignatureCanvas ref={sigCanvas} penColor={penColor} canvasProps={{ width: 400, height: 150, className: "border rounded-lg" }} />
              <div className="flex gap-2 mt-2">
                <Button onClick={saveSignature}><PenTool className="mr-2" /> Save Signature</Button>
                <Button variant="outline" onClick={clearSignature}><Trash2 className="mr-2" /> Clear</Button>
              </div>
              <div className="mt-4">
                <input type="text" placeholder="Type your signature" className="border p-2 rounded w-full" value={typedSignature} onChange={(e) => setTypedSignature(e.target.value)} />
                <input type="file" className="mt-2" onChange={handleFileUpload} />
              </div>
              <div className="mt-4">
                <label className="font-bold mr-2">Pen Color:</label>
                <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} />
              </div>
              {signature && <img src={signature} alt="Saved Signature" className="mt-4 border rounded-lg" width={200} />}
              {typedSignature && <p className="mt-2 border p-2 rounded text-lg">{typedSignature}</p>}
              {uploadedSignature && <img src={uploadedSignature} alt="Uploaded Signature" className="mt-2 border rounded-lg" width={200} />}
            </Card>

            {/* Display uploaded documents at the bottom */}
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Uploaded Documents</h2>
              {documents.map((doc, index) => (
                <div key={index} className="border p-2 rounded-lg flex justify-between items-center mb-2">
                  <span>{doc.name}</span>
                  <Button variant="outline" onClick={() => handleDelete(index)}><Trash2 className="mr-2" /> Delete</Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
