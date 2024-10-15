import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import Home from './Pages/Home';
import Login from './Pages/auth/Login';
import Signup from './Pages/auth/Signup';
import ForgotPassword from './Pages/auth/ForgotPassword';
import ResetPassword from './Pages/auth/ResetPassword';
import VerifyEmail from './Pages/auth/VerifyEmail';
import Profile from './Pages/Profile';
import SearchPage from './Pages/SearchPage';
import RestaurantPage from './Pages/RestaurantPage';
import CartPage from './Pages/CartPage';
import Restaurant from './Pages/admin/Restaurant';
import Menu from './Pages/admin/Menu';
import Orders from './Pages/admin/Orders';
import MainLayout from './components/MainLayout';
import { useUserStore } from './Stores/useUserStore';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomerOrders from './Pages/CustomerOrders';
import Loading from './components/Loading';
import OrderSuccess from './Pages/OrderSuccess';
import { useThemeStore } from './Stores/useThemeStore';

const ProtectedRoute = ({ children, isAuthenticated, user }) => {
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    user: PropTypes.object,
  };
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const VerifiedUser = ({ children }) => {
  VerifiedUser.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const { isAuthenticated, user } = useUserStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />
  }
  return children;
};
const AuthenticatedUser = ({ children }) => {
  AuthenticatedUser.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const { isAuthenticated, user } = useUserStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />
  }
  if (isAuthenticated && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};

// Admin-specific route protection
const AdminRoute = ({ children, user }) => {
  AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.object,
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { user, checkAuth, isAuthenticated, isCheckingAuth } = useUserStore();
  const {initializeTheme} = useThemeStore();

  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  if (isCheckingAuth) {
    return<Loading/>;
  }

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated} user={user}>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <Home /> },
        { path: '/profile', element: <Profile /> },
        { path: '/orders', element: <CustomerOrders /> },
        { path: '/cart', element: <CartPage /> },
        { path: '/add-my-restaurant', element: <Restaurant /> },
        { path: '/search/:searchText', element: <SearchPage /> },
        { path: '/restaurant/:restaurantId', element: <RestaurantPage /> },
        { path: '/order-success', element: <OrderSuccess /> },
        // Admin routes
        {
          path: '/admin/restaurant',
          element: (
            <AdminRoute user={user}>
              <Restaurant />
            </AdminRoute>
          ),
        },
        {
          path: '/admin/menu',
          element: (
            <AdminRoute user={user}>
              <Menu />
            </AdminRoute>
          ),
        },
        {
          path: '/admin/orders',
          element: (
            <AdminRoute user={user}>
              <Orders />
            </AdminRoute>
          ),
        },
      ],
    },

    { path: '/login', element: <AuthenticatedUser><Login /></AuthenticatedUser> },
    { path: '/signup', element: <AuthenticatedUser><Signup /></AuthenticatedUser> },
    { path: '/forgot-password', element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser>},
    { path: '/reset-password/:resetToken', element: <ResetPassword /> },
    { path: '/verify-email', element: <VerifiedUser><VerifyEmail /></VerifiedUser> },

    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
