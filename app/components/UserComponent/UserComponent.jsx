"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/contexts/userContext";
import UserPage from "../UserPage/UserPage";
import LoginComponent from "../LoginComponent/LoginComponent";
import AdminPage from "../Admin/AdminPage";
import { TailSpin } from "react-loader-spinner";

const UserComponent = () => {
  const { user } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <TailSpin
            height="80"
            width="80"
            color="#ff0000"
            ariaLabel="tail-spin-loading"
          />
        </div>
      )}
      {!isLoading && (
        <>
          {user ? (
            user.isadmin ? (
              <AdminPage />
            ) : (
              <UserPage />
            )
          ) : (
            <LoginComponent />
          )}
        </>
      )}
    </>
  );
};

export default UserComponent;