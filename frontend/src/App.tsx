import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import CoursesPage from './pages/super-admin/CoursesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import { useAuth } from './auth/AuthContext';
import CampusesPage from './pages/super-admin/CampusesPage';
import TrainersPage from './pages/super-admin/TrainersPage';
import EnrollmentsPage from './pages/super-admin/EnrollmentsPage';
import UsersPage from './pages/super-admin/UsersPage';
import UserDetailPage from './pages/super-admin/UserDetailPage';
import StudentsPage from './pages/super-admin/StudentsPage';
import StudentDetailPage from './pages/super-admin/StudentDetailPage';

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <Navigate to="/super-admin" replace />;
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'TRAINER':
      return <Navigate to="/trainer" replace />;
    case 'STUDENT':
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RoleRedirect />} />

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <DashboardLayout><SuperAdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/super-admin/students" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><DashboardLayout><StudentsPage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/super-admin/students/:id" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><DashboardLayout><StudentDetailPage /></DashboardLayout></ProtectedRoute>} />

        <Route
          path="/super-admin/users"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <DashboardLayout><UsersPage /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <DashboardLayout><UserDetailPage /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/enrollments"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <DashboardLayout><EnrollmentsPage /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/trainers"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <DashboardLayout><TrainersPage /></DashboardLayout>
          </ProtectedRoute>
          }
        />  
        
        <Route
          path="/super-admin/courses"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <DashboardLayout><CoursesPage /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/campuses"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <DashboardLayout><CampusesPage /></DashboardLayout>
            </ProtectedRoute>
          }
        />    

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRoles={['TRAINER']}>
              <DashboardLayout><TrainerDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<div style={{ padding: 24 }}>Unauthorized</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;