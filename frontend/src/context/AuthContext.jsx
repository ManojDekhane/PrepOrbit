import { useState, createContext, useContext } from "react";
import API from "../utils/axios";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Check if user is logged in on app load
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await API.get("/auth/check");
                console.log("Auth Check Response:", res.data);
                setUser(res.data.user);
            } catch (err) {
                console.error("Auth Check Failed:", err);
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);