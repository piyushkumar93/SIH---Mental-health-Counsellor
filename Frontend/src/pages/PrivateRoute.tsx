import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user")); 
  // user object should look like: { name: "John", role: "admin" }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
