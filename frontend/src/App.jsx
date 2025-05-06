// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/auth/Auth';
// import Post from './components/auth/Post';
import Profile from './components/profile/Profile';
import Dashboard from './components/dashboard/Dashboard';
import { ToastProvider } from './components/common/Toast';
import Messaging from './components/messaging/Messaging';
import SinglePostView from './components/post/SinglePostView';
import CreateLearningPlan from './components/profile/components/CreateLearningPlan';
import ViewLearningPlans from './components/profile/components/ViewLearningPlans';
import EditLearningPlan from './components/profile/components/EditLearningPlan';
import ViewAllLearningPlans from './components/profile/components/ViewAllLearningPlans';
import OtherLearningPlans from './components/profile/components/OtherLearningPlans';
import AdminLayout from './components/admin/AdminLayout';
import ResourceList from './components/admin/resources/ResourceList';
import ResourceForm from './components/admin/resources/ResourceForm';
import ResourceEdit from './components/admin/resources/ResourceEdit';
import ResourceHub from './components/resourcehub/ResourceHub';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} /> {/* Current user profile */}
          <Route path="/profile/:userId" element={<Profile />} /> {/* Add this route for viewing other users */}
          <Route path="/messages" element={<Messaging />} />
          <Route path="/messages/:userId" element={<Messaging />} />
          <Route path="/post/:postId" element={<SinglePostView />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/learning-plans/my-plans" element={<ViewLearningPlans />} />
          <Route path="/learning-plans/create" element={<CreateLearningPlan />} /> 
          <Route path="/learning-plans/edit/:id" element={<EditLearningPlan />} /> 
          <Route path="/learning-plans" element={<ViewAllLearningPlans />} />
          <Route path="/learning-plans/followed" element={<OtherLearningPlans />} />
          <Route path="/resources/hub" element={<ResourceHub />} />

          

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