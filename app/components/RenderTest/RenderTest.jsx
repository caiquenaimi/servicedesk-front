import styles from "./renderTeste.module.css";
import { useContext } from "react";
import { UserContext } from "@/app/contexts/userContext";
import { useRouter } from "next/navigation";

export default function RenderTest({
  local,
  desc,
  autor,
  status,
  title,
  onEdit,
  image,
  priority
}) {
  const { user } = useContext(UserContext);

  const statusStyle = () => {
    if(status == 'aguardando') {
      return styles.statusInconclued
    } else if( status == 'em andamento') {
      return styles.statusPending
    } else {
      return styles.statusCompleted
    }
  }

  const priorityStyle = () => {
    if(priority == 'alta') {
      return styles.high
    } else if(priority == 'média') {
      return styles.medium
    } else {
      return styles.low
    }
   }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={local}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={priorityStyle()}>

        </div>
        {user && user.isadmin && (
                <>
                  <p
                    className={statusStyle()}
                  >
                    {status.toUpperCase()}
                  </p>
                </>
              )}
      </div>
    </div>
  );
}