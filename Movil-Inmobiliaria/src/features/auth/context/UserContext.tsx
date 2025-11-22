import React, { createContext, useContext, useState, ReactNode } from "react";
import usuariosDataRaw from "../../../core/storage/usuarios.json";
const usuariosData = usuariosDataRaw as UserData[];

export interface UserData {
  id: number;
  usuario: string;
  password: string;
  nombre: string;
  rol: string;
  area: string;
  dni: string;
  edad: number;
  genero: string;
  telefono: string;
  correo: string;
  direccion: string;
  fotoPerfil?: string;
}

interface UserContextType {
  userData: UserData | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  updateProfilePhoto: (photoUri: string) => void;
  register: (newUser: Omit<UserData, "id" | "fotoPerfil">) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarios, setUsuarios] = useState<UserData[]>(usuariosData);

  const login = (username: string, password: string): boolean => {
  // Combinar usuarios base (JSON) y nuevos registrados en el estado
  const todosLosUsuarios = [...usuariosData, ...usuarios];

  // Buscar el usuario por nombre y contraseña
  const user = todosLosUsuarios.find(
    (u) => u.usuario === username && u.password === password
  );

    if (user) {
      setUserData({
        ...user,
        fotoPerfil:
          user.fotoPerfil ||
          "https://placehold.co/120x120/0ea4a3/ffffff?text=👤",
      });
      setIsLoggedIn(true);
      return true;
    }

  return false;
};



  const logout = () => {
    setUserData(null);
    setIsLoggedIn(false);
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setUserData((prev) => (prev ? { ...prev, ...newData } : prev));
  };

  const updateProfilePhoto = (photoUri: string) => {
    setUserData((prev) =>
      prev ? { ...prev, fotoPerfil: photoUri } : prev
    );
  };

    const register = (newUser: Omit<UserData, "id" | "fotoPerfil">): boolean => {
    // Verificar si el usuario ya existe
    if (usuarios.some((u) => u.usuario === newUser.usuario)) {
      return false;
    }

    // Crear nuevo usuario
    const id = usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1;
    const userToAdd: UserData = {
      id,
      fotoPerfil: "https://placehold.co/120x120/0ea4a3/ffffff?text=👤",
      ...newUser,
    };

    setUsuarios((prev) => [...prev, userToAdd]);
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoggedIn,
        login,
        logout,
        updateUserData,
        updateProfilePhoto,
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
