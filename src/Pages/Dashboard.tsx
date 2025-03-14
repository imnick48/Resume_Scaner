import React, { useEffect, useState } from 'react';
import ProjectCard from '../Components/Projectcard';
import axios from 'axios';

interface prj {
  id: number;
  name: string;
  description: string; 
  recruiter_id: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<prj[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [Uid, setUId] = useState('');
  const [formData, setFormData] = useState({ 
    name: "", 
    jd: "", 
    recruiter_id: "" 
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('userId');
    setUId(id || '');
    
    if (id) {
      axios.get(`http://127.0.0.1:5000/projects/${id}`)
        .then((response) => {
          setProjects(response.data);
        })
        .catch((error) => {
          console.error(`Error fetching data: ${error}`);
        });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      recruiter_id: Uid
    }));
  };
  const handleAddProject = () => {
    if (!formData.name || !formData.jd) {
      alert('Please fill in all required fields');
      return;
    }

    axios.post("http://127.0.0.1:5000/Create-Jobs", formData)
      .then(response => {
        console.log("Success:", response.data);
        const newProject = response.data;
        setProjects([...projects, newProject]);
        setFormData({ name: "", jd: "", recruiter_id: Uid });
        setShowForm(false);
      })
      .catch(error => {
        console.error("Error:", error);
        alert('Failed to create project. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Dashboard</h1>
            <p className="text-gray-600">Manage and track your project portfolio</p>
          </div>
          <button
            className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            onClick={() => setShowForm(true)}
          >
            + New Project
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-indigo-100 text-indigo-700"
          >
            All Projects
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              id={(project.id).toString()}
            />
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No projects found</div>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => setShowForm(true)}
            >
              Create New Project
            </button>
          </div>
        )}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Project</h2>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Project Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jd">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="jd"
                  name="jd"
                  placeholder="Enter project description"
                  rows={3}
                  value={formData.jd}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  onClick={handleAddProject}
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;