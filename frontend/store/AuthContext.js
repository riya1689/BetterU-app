import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // If user is null, they are logged out
  const [isLoading, setIsLoading] = useState(true); // To show a loading screen at start

  // --- Mock Functions (we will connect these to the API later) ---
  
  const login = (email, password) => {
    console.log('Login function called with:', email, password);
    // In a real app, you'd call your API here.
    // For now, we'll just simulate a successful login.
    setUser({ name: 'Riya Das', email: email }); 
  };

  const signup = (name, email, password) => {
    console.log('Signup function called with:', name, email, password);
    // In a real app, you'd call your API here.
    setUser({ name: name, email: email });
  };

  const logout = () => {
    console.log('Logout function called');
    setUser(null); // Set user to null to log them out
  };
  
  // This will run once when the app starts to check if the user is already logged in
  // For now, we'll just pretend it's loading for a second.
  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);


  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to use the context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
