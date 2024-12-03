
'use client';
import { createContext, useEffect, useState } from "react";
import { refreshAccessToken, getUserByEmail } from "../actions/users";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    // Função para verificar se o token expirou
    const isTokenExpired = (token) => {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken.exp * 1000 < Date.now();
    };

    // Função para buscar os dados do usuário
    const fetchUser = async (accessToken) => {
        try {
            // Decodificar o token para pegar o email
            const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
            const email = decodedToken.email;
            
            const userData = await getUserByEmail(email);
            setUser(userData);
        } catch (error) {
            console.log("Erro ao buscar dados do usuário:", error);
        }
    };

    // Função para logar automaticamente o usuário se o refreshToken estiver salvo
    const tryLoginWithRefreshToken = async () => {
        const savedRefreshToken = localStorage.getItem('refreshToken');

        if (savedRefreshToken) {
            try {
                const response = await refreshAccessToken(savedRefreshToken);

                if (response.accessToken && response.refreshToken) {
                    setAccessToken(response.accessToken);
                    setRefreshToken(response.refreshToken);
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);

                    // Buscar dados do usuário
                    await fetchUser(response.accessToken);
                }
            } catch (error) {
                console.log("Erro ao renovar o token:", error);
                // Caso o refreshToken esteja inválido ou expirado, limpamos o localStorage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
    };

    // Ao montar o componente, tenta logar o usuário automaticamente
    useEffect(() => {
        const savedAccessToken = localStorage.getItem('accessToken');
        const savedRefreshToken = localStorage.getItem('refreshToken');

        if (savedAccessToken && savedRefreshToken) {
            if (isTokenExpired(savedAccessToken)) {
                tryLoginWithRefreshToken();
            } else {
                setAccessToken(savedAccessToken);
                setRefreshToken(savedRefreshToken);
                // Buscar dados do usuário se o token ainda for válido
                fetchUser(savedAccessToken);
            }
        }
    }, []);

    // Rotina para renovar o token periodicamente
    useEffect(() => {
        const interval = setInterval(async () => {
            if (accessToken && isTokenExpired(accessToken)) {
                tryLoginWithRefreshToken();
            }
        }, 3600 * 1000); // Verifica a cada 1 minuto
        return () => clearInterval(interval);
    }, [accessToken, refreshToken]);

    return (
        <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken, refreshToken, setRefreshToken }}>
            {children}
        </UserContext.Provider>
    );
};
