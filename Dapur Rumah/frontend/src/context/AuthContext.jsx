import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preview mode: no API call, just check localStorage for mock session
    try {
      const savedUser = localStorage.getItem("dapur_mock_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    // Preview mode: mock login — always succeeds
    const mockUser = {
      id: "mock-user-1",
      name: email.split("@")[0],
      email,
      role: "seller",
    };
    setUser(mockUser);
    localStorage.setItem("dapur_mock_user", JSON.stringify(mockUser));
    return { success: true, token: "mock-token" };
  }

  async function register(name, email, password) {
    // Preview mode: mock register — always succeeds
    const mockUser = {
      id: "mock-user-" + Date.now(),
      name,
      email,
      role: "seller",
    };
    setUser(mockUser);
    localStorage.setItem("dapur_mock_user", JSON.stringify(mockUser));
    return { success: true, token: "mock-token" };
  }

  async function logout() {
    // Preview mode: just clear state
    localStorage.removeItem("dapur_mock_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, checkSession: () => {} }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
