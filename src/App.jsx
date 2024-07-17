import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import Profile from "./components/Profile";
import "./App.css";
import { useEffect, useState } from "react";
import { loginSuccess } from "./Redux/Slices/userSlice";
import { getUserAuth } from "./firebase/functions";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getUserAuth();
        if (user) {
          dispatch(loginSuccess(user));
          console.log("user is signed in");
        } else {
          console.log("No user is signed in");
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
      }
    };
    checkUser();
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <img src="/images/logo.png" alt="LinkedIn Logo" />
        <LoadingBar />
      </LoadingContainer>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            user ? (
              <>
                <Header />
                <Home />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/profile" element={<><Profile />    <Header /></>} />
      </Routes>
    </BrowserRouter>
  );
}

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;

  img {
    width: 180px;
    object-fit: contain;
  }
`;

const LoadingBar = styled.div`
  margin-top: 20px;
  width: 130px;
  height: 4px;
  background: linear-gradient(90deg, rgba(56, 56, 56, 0.1) 25%, rgb(40, 106, 240) 50%, rgb(40, 106, 240) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }
`;

export default App;
