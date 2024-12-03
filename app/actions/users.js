'use server';
import axios from "axios";
import bcrypt from 'bcrypt';

const api = process.env.URL || process.env.BACKUP_AWS;    

export const getAllUsers = async() => {
    try {
        const response = await axios.get(`${api}/users`);
        return response.data;
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}


export const getUserByEmail = async(email) => {
    try {
        const response = await axios.get(`${api}/users/${email}`);
        return response.data;        
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const getUserByName= async(name) => {
    try {
        const response = await axios.get(`${api}/users/name/${name}`);
        return response.data;
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const getUserByRole = async(role) => {
    try {
        const response = await axios.get(`${api}/users/role/${role}`);
        return response.data;
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const loginInAPI = async({ email, password }) => {
    try {
      const response = await axios.post(`${api}/authenticate`, { email, password });
  
      if (response.data && response.data.refreshToken && response.data.accessToken) {
        return {
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        };
      }
      return { error: 'credenciais inválidas' };
    } catch (e) {
        return e.response.data || { error: 'operação fracassou' };
    }
  };

export const createUser = async(user) => {
    try {
        const response = await axios.post(`${api}/users`, { 
            name: user.name.toLowerCase(), email: user.email, password: user.password, isAdmin: user.isAdmin, isStudent: user.isStudent 
        });
        return response.data;        
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const updateUser = async(user, email) => {
    try {
        const response = await axios.put(`${api}/users/${email}`, { 
            name: user.name, email: user.email, password: user.password, isAdmin: user.isAdmin, isStudent: user.isStudent 
        });
        return response.data;
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const deleteUser = async(email) => {
    try {
        const response = await axios.delete(`${api}/users/${email}`);
        return response.data;
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const changePassword = async(password, confirmPassword, email, token) => {
    try {
        const response = await axios.patch(
            `${api}/users/change/password/${email}`, 
            { password: password, confirmPassword: confirmPassword},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(response.data);
        return response.data;
    } catch(e) {
        return e.response.data || { error: 'operação fracassou' };
    }
}

export const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(`${api}/authenticate/refresh`, { refreshToken });
      return response.data;  // Retorna novo accessToken e refreshToken
    } catch (e) {
        return e.response.data || { error: 'operação fracassou' };
    }
  };

  export const compare = async(password, hash) => {
        try {
            const response = await bcrypt.compare(password, hash);
            console.log(response);
            return response;
        } catch (erro) {
            console.error("Erro ao comparar a senha:", erro);
            return res.status(500).json(false); 
        }
    } 



  