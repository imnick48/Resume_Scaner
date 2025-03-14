import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface ResumeDB {
  id: number;
  name: string;
  email: string;
  path: string;
  similarity: string;
  improvements: string
  job_id: string;
}

const JobsDashboard = () => {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [resume, setResume] = useState<ResumeDB[]>([]);
  const [highestSim, setHighestSim] = useState<number>(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('projectId');
    setProjectId(id ? parseInt(id, 10) : null);
    console.log(id);
    
    if (id) {
      axios.get(`http://127.0.0.1:5000/jobdetails/${id}`)
        .then((response) => {
          const data = response.data;
          setResume(data);
          if (data && data.length > 0) {
            const maxSimilarity = Math.max(...data.map((p: { similarity: string; }) => parseFloat(p.similarity) || 0));
            setHighestSim(maxSimilarity);
          }
        })
        .catch((error) => {
          console.log("Error: " + error);
        });
    }
  }, []);

  const copyLinkToClipboard = () => {
    const currentUrl = `http://localhost:5173/upload?projectId=${projectId}`;
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };

  const stats = [
    { title: 'Total Resumes', value: resume.length, icon: '👥' },
    { title: 'Highest Match', value: `${highestSim.toFixed(2)}%`, icon: '📊'},
  ];

  return (
    <div className="font-sans m-0 p-0">
      <header className="bg-transparent p-5 border-b border-gray-200 text-center">
        <h1 className="m-0 text-2xl font-bold text-gray-800">
          Dashboard {projectId ? `- Project ID: ${projectId}` : ''}
        </h1>
      </header>
      <main className="p-5">
        <section className="flex justify-around flex-wrap mb-5">
          {stats.map((stat, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 m-2 flex-1 basis-48 shadow-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl mr-2">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="m-0 mb-1 text-lg">{stat.value}</h3>
                  <p className="m-0 text-gray-500">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="mt-5 mb-5">
          <h2 className="mb-2">Resume Upload Link</h2>
          <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden">
            <input 
              type="text" 
              readOnly 
              value={`http://localhost:5173/upload?projectId=${projectId}`}
              className="flex-1 py-3 px-4 text-base bg-gray-100 text-gray-700 outline-none cursor-default"
            />
            <button 
              onClick={copyLinkToClipboard} 
              className="px-5 bg-indigo-500 text-white border-none cursor-pointer text-base font-bold transition-colors"
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>
          {copySuccess && <p className="text-green-500 mt-2 text-sm">Link copied to clipboard!</p>}
        </section>
        <section className="mt-5">
          <h2 className="mb-2">Recent Orders</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b-2 border-gray-200">ID</th>
                <th className="text-left p-2 border-b-2 border-gray-200">Applicant Name</th>
                <th className="text-left p-2 border-b-2 border-gray-200">Email</th>
                <th className="text-left p-2 border-b-2 border-gray-200">Similarity</th>
                <th className="text-left p-2 border-b-2 border-gray-200">Improvements</th>
              </tr>
            </thead>
            <tbody>
              {resume && resume.length > 0 ? (
                resume.map(order => (
                  <tr key={order.id}>
                    <td className="p-2 border-b border-gray-100">{order.id}</td>
                    <td className="p-2 border-b border-gray-100">{order.name}</td>
                    <td className="p-2 border-b border-gray-100">{order.email}</td>
                    <td className="p-2 border-b border-gray-100">{order.similarity}</td>
                    <td className="p-2 border-b border-gray-100">{order.improvements}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-2 border-b border-gray-100 text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default JobsDashboard;