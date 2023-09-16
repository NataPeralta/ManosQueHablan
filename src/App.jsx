import {BrowserRouter, Routes, Route} from "react-router-dom";
import UserList from "./pages/StudentList";
import Home from "./pages/Home";
import UserProfile from "./pages/StudentProfile";
import PaymentsList from "./pages/PaymentsList";
import Navbar from "./partials/navbar";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Students */}
        <Route path="/students" element={<UserList />} />
        <Route path="/students/:studentId" element={<UserProfile />} />
        {/* Payments */}
        <Route path="/payments" element={<PaymentsList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
