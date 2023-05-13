const { Navigate } = require('react-router-dom');

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('user-jwt-tk');
  const refreshToken = localStorage.getItem('user-jwt-rftk');

  if (!token || !refreshToken) {
    return <Navigate to='/login' />;
  }
  return children;
};

export default RequireAuth;
