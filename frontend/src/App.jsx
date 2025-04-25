// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Messaging from './components/messaging/Messaging';
import SinglePostView from './components/post/SinglePostView';
import { ToastProvider } from './components/common/Toast';
import AdminLayout from './components/admin/AdminLayout';
import ResourceList from './components/admin/resources/ResourceList';
import ResourceForm from './components/admin/resources/ResourceForm';
import ResourceEdit from './components/admin/resources/ResourceEdit';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/messages" element={<Messaging />} />
          <Route path="/messages/:userId" element={<Messaging />} />
          <Route path="/post/:postId" element={<SinglePostView />} />

          {/* Admin protected */}
          <Route path="/admin" element={<AdminLayout />}>            
            <Route index element={<Navigate to="resources" replace />} />
            <Route path="resources" element={<ResourceList />} />
            <Route path="resources/create" element={<ResourceForm />} />
            <Route path="resources/edit/:id" element={<ResourceEdit />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;