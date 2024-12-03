import { Header } from "../components/Header/header";
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