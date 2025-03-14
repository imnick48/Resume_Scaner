import React from 'react';
interface ProjectCardProps {
  name: string;
  description?: string;
  id: string;
}
const ProjectCard: React.FC<ProjectCardProps> = ({ 
  name, 
  description,
  id 
}) => {
  const handleOpenProject = () => {
    window.location.href = `http://localhost:5173/jobx?projectId=${id}`;
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 group">
      <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
          <button 
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            onClick={handleOpenProject}
          >
            Open Project
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;