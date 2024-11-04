import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import LoginPage from './pages/LoginPage';
import BoardPage from './pages/BoardPage';
import PrivateRoute from './generalComponents/PrivateRoute';
import { loadProfile } from './slices/authSlice';
import Layout from './generalComponents/layout/Layout';
interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: object | null;
  };
}

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(loadProfile());
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center">
            <div className="text-xl font-semibold">Loading...</div>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/board" replace /> : <LoginPage />
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/board" replace /> : <LoginPage />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/board"
            element={
              <PrivateRoute element={() => (
                <Layout>
                  <BoardPage />
                </Layout>
              )} />
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
