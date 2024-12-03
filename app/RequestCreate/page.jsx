import { Header } from "../components/Header/Header.jsx";
import styles from "./requestcreate.module.css";
import RequestCreateComponent from "../components/RequestCreateComponent/RequestCreateComponent.jsx";

export default function RequestCreate() {
  return (
    <div className={styles.generalDiv}>
      <Header />
      <div className={styles.component}>
        <RequestCreateComponent />
      </div>
    </div>
  );
}