import { useState, useEffect } from 'react'
import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AddContactPage from './pages/AddContactPage.jsx';
import CreateGroupPage from "./pages/CreateGroupPage.jsx"
import GroupPage from "./pages/GroupPage.jsx"

import { Routes, Route,Navigate } from "react-router-dom"
import React from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import {useThemeStore} from './store/useThemeStore.js';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import StatusList from './components/StatusList.jsx';


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => { checkAuth(); }, [checkAuth]);

  console.log({ authUser })
  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  return (
    <div data-theme={theme}>
      <Navbar />
       <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/add-contact" element={authUser ? <AddContactPage /> : <Navigate to="/login" />} />
        <Route path="/create-group" element={authUser ? <CreateGroupPage /> : <Navigate to="/login" />} />
        <Route path="/groups" element={authUser ? <GroupPage /> : <Navigate to="/login" />} />
        <Route path="/status" element={authUser ? <StatusList /> : <Navigate to="/login" />} />
      </Routes>
<Toaster/>
    </div>
  )
}

export default App
