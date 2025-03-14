import React, { useState, ChangeEvent, DragEvent, FormEvent, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const Upload_Resume: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('projectId');

    if (id) {
      setProjectId(parseInt(id, 10));
    }
  }, []);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", resumeFile as Blob);
    try {
      const response = await axios.post(`http://127.0.0.1:5000/upload-resume/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
        params: {
          name: fullName,
          email: email,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 mb-4">
            Application Portal
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Information</h1>
          <p className="text-gray-600">
            Please provide your details and resume<br />
            to complete your application process.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-gray-800 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email Address */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Resume Upload */}
            <div className="mb-8">
              <label className="block text-gray-800 mb-2">
                Resume
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <ArrowUpRight className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-gray-800 font-medium mb-2">
                  {resumeFile ? resumeFile.name : 'Upload your resume'}
                </p>
                <p className="text-gray-500 text-sm">
                  Drag & drop or click to browse (PDF or Word, max 5MB)
                </p>
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('resume')?.click()}
                  className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                >
                  Browse files
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              Submit Application
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload_Resume;
