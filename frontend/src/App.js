import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUpStep1 from "./components/SignUpStep1";
import SignUpStep2 from "./components/SignUpStep2";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Search from "./components/search/search-alt";
import MovieDetail from "./components/movie/MovieDetail";
import BookingPage from "./components/booking/BookingPage";
import BookingConfirmation from "./components/booking/BookingConfirmation";
import MyTickets from './components/MyTickets';
import Comments from "./components/CommentsPage";
import Admin from "./components/Admin";
import PaymentPage from './components/PaymentPage';
import "./App.css";

const App = () => {
  return (
    <div className="page-background">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup/step1" element={<SignUpStep1 />} />
          <Route path="/signup/step2" element={<SignUpStep2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/comments/:id" element={<Comments/>} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;