import { Header } from "../components/Header/Header.jsx";
import styles from "./request.module.css";
import RequestComponent from "../components/RequestComponent/RequestComponent";

export default function Request() {
  return (
    <div className={styles.generalDiv}>
      <Header />
      <RequestComponent />
    </div>
  );
}