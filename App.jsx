 import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import EmployerApplications from "./pages/EmployerApplications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/post-job" element={<PostJob />} />
        <Route
          path="/my-applications"
          element={<MyApplications />}
        />
        <Route
          path="/applications"
          element={<EmployerApplications />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;