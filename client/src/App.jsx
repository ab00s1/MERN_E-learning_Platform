import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Verify from "./pages/Auth/Verify";
import Reset from "./pages/Auth/Reset";
import About from "./pages/About/About";
import Profile from "./pages/Profile/Profile";
import Courses from "./pages/Courses/Courses";
import CourseDescription from "./pages/CourseDescription/CourseDescription";
import Lecture from "./pages/Lecture/Lecture";
import AddCourse from "./pages/Admin/AddCourse";
import AddLecture from "./pages/Admin/AddLecture";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import PaymentSuccess from "./components/Payment/PaymentSuccess";
import PaymentCancel from "./components/Payment/PaymentCancel";
import "./App.css";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/verify" element={<Verify />} />
            <Route path="/login/reset-password" element={<Reset />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:CourseId" element={<CourseDescription />} />
            <Route path="/courses/:CourseId/lectures" element={<Lecture />} />
            <Route path="/admin/course/new" element={<AddCourse />} />
            <Route path="/admin/course/:CourseId/addLecture" element={<AddLecture />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
