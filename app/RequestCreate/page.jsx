import { Header } from "../components/Header/Header";
import styles from "./requestcreate.module.css";
import RequestCreateComponent from "../components/RequestCreateComponent/RequestCreateComponent";

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