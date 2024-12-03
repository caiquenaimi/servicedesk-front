import React from "react";
import Link from "next/link";
import styles from "./sidebarItem.module.css";

const SidebarItem = ({ Icon, Text, href }) => {
  return (
    <Link className={styles.container} href={href}>
      <Icon />
      <span className={styles.span}>{Text}</span>
    </Link>
  );
};

export default SidebarItem;