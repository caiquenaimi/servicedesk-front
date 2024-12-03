"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Hamburger from "hamburger-react";
import {
  FaHome,
  FaTools,
  FaUser,
  FaUserLock,
  FaUserCog,
  FaUserPlus,
  FaHiking,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TfiYoutube } from "react-icons/tfi";
import { UserContext } from "../../contexts/userContext.jsx";
import styles from "./header.module.css";

const SidebarItem = ({ Icon, Text, href }) => {
  return (
    <Link className={styles.container} href={href}>
      <Icon />
      <span style={{ marginLeft: 15 }}>{Text}</span>
    </Link>
  );
};

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
        width: "12rem",
      }}
    >
      <div className={styles.container}>
        <SidebarItem Icon={FaHome} Text="Início" href="/" />
        <SidebarItem Icon={FaTools} Text="Solicitações" href="/Request" />
        {user ? (
          <>
            <SidebarItem
              Icon={user.isadmin ? FaUserLock : FaUserCog}
              Text={user.isadmin ? "Admin" : "Perfil"}
              href="/Login"
            />
            {user.isadmin && (
              <SidebarItem
                Icon={FaUserPlus}
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
            <SidebarItem Icon={FaUserPlus} Text="Registrar" href="/Register" />
            <SidebarItem Icon={FaUser} Text="Login" href="/Login" />
          </>
        )}
      </div>
    </div>
  );
};

export const Header = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const closeSidebar = () => setSidebar(false);

  return (
    <nav className={styles.generalDiv}>
      <div className={styles.menuD}>
        <div className={styles.align}>
          <Hamburger
            toggled={sidebar}
            toggle={showSidebar}
            color="#fff"
            clasName={styles.top}
          />
          {sidebar && <Sidebar isActive={sidebar} onClose={closeSidebar} />}
        </div>
      </div>
      <ul className={styles.menu}>
        <li className={styles.links}>
          <Link target="blank" href="https://www.fiesp.com.br/">
            FIESP
          </Link>
        </li>
        <li className={styles.links}>
          <Link target="blank" href="https://www.ciesp.com.br/">
            CIESP
          </Link>
        </li>
        <li className={styles.links}>
          <Link target="blank" href="https://www.sesisp.org.br/">
            SESI
          </Link>
        </li>
        <li id={styles.senai}>
          <Link target="blank" href="https://www.sp.senai.br/">
            SENAI
          </Link>
        </li>
        <li className={styles.links}>
          <Link target="blank" href="https://www.fiesp.com.br/">
            IRS
          </Link>
        </li>
        <span style={{ marginLeft: -15 }} className={styles.barra}>
          |
        </span>
        <li className={styles.linksSocial}>
          <Link target="blank" href="https://www.facebook.com/senaisaopaulo">
            <FaFacebookF color="#ffffff" />
          </Link>
        </li>
        <span className={styles.barra}>|</span>
        <li className={styles.linksSocial}>
          <Link target="blank" href="https://twitter.com/senaisaopaulo">
            <FaXTwitter color="#ffffff" />
          </Link>
        </li>
        <span className={styles.barra}>|</span>
        <li className={styles.linksSocial}>
          <Link
            target="blank"
            href="https://www.youtube.com/channel/UCaz1BMUVug86pd_uS598X1A"
          >
            <TfiYoutube color="#ffffff" />
          </Link>
        </li>
        <span className={styles.barra}>|</span>
        <li className={styles.linksSocial}>
          <Link target="blank" href="https://www.linkedin.com/company/senai-sp">
            <FaLinkedinIn color="#ffffff" />
          </Link>
        </li>
        <span className={styles.barra}>|</span>
        <li className={styles.linksSocial}>
          <Link target="blank" href="https://www.instagram.com/senai.sp">
            <FaInstagram color="#ffffff" />
          </Link>
        </li>
        <span className={styles.barra}>|</span>
        <li className={styles.linksSocial}>
          <Link
            target="blank"
            href="https://api.whatsapp.com/send?phone=551133220050"
          >
            <FaWhatsapp color="#ffffff" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};