import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobsDashboard from "../Pages/job-dashboard";
import Home from '../Pages/Home';
import Upload_Resume from '../Pages/upload';
import Dashboard from '../Pages/Dashboard';
import LoginPage from '../Pages/login';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard/>}></Route>
            <Route path="/jobx" element={<JobsDashboard />} />
            <Route path="/upload" element={<Upload_Resume/>} />
        </Routes>
    );
};
export default AppRouter;