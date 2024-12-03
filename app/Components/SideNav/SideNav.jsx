import {
    FaHome,
    FaTools,
    FaUser,
    FaRegSun,
    FaUserLock,
    FaUserCog,
    FaHiking,
  } from "react-icons/fa";
  import SidebarItem from "../SidebarItem/SidebarItem";
  import styles from "./sideNav.module.css";
  import { useContext } from "react";
  import { UserContext } from "@/app/contexts/userContext";
  import { useRouter } from "next/navigation";
  
  const Sidebar = ({ isActive, onClose }) => {
    const { user, setUser } = useContext(UserContext);
  
    const router = useRouter();
  
    const logoff = () => {
      setUser(null);
      localStorage.clear();
      router.replace("/");
    };
  
    return (
      <div
        className={`sidebar ${isActive ? "sidebar-open" : ""}`}
        style={{
          backgroundColor: "#ff0000",
          height: "100vh",
          position: "fixed",
          zIndex: 999,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className={styles.container}>
          <SidebarItem Icon={FaHome} Text="Início" href="/" />
  
          <SidebarItem Icon={FaTools} Text="Solicitações" href="/Request" />
  
          {user ? (
            <>
              <SidebarItem Icon={FaUserCog} Text="Perfil" href="/Login" />
              {user.isadmin && (
                <SidebarItem
                  Icon={FaUserLock}
                  Text="Registrar"
                  href="/Register"
                />
              )}
              <div onClick={logoff} className={styles.exit}>
                <SidebarItem Icon={FaHiking} Text="Sair" href="./" />
              </div>
            </>
          ) : (
            <>
              <SidebarItem Icon={FaUserLock} Text="Registrar" href="/Register" />
              <SidebarItem Icon={FaUser} Text="Login" href="/Login" />
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default Sidebar;