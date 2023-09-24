import {BrowserRouter, Routes, Route} from "react-router-dom";
import StudentList from "./pages/StudentList";
import Home from "./pages/Home";
import StudentProfile from "./pages/StudentProfile";
import PaymentsList from "./pages/PaymentsList";
import Navbar from "./partials/navbar";
import CoursesList from "./pages/CoursesList";
import LevelList from "./pages/LevelList";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Students */}
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/:studentId" element={<StudentProfile />} />
        {/* Payments */}
        <Route path="/payments" element={<PaymentsList />} />
        {/* Courses */}
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:coursesId" element={<LevelList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
