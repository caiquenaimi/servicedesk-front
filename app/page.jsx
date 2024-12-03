"use client";
import { motion } from "framer-motion";
import { useContext } from "react";
import { GoTools } from "react-icons/go";
import { IoCamera } from "react-icons/io5";
import { IoIosPin } from "react-icons/io";
import { BsPencilSquare } from "react-icons/bs";
import Link from "next/link";
import { Header } from "@/app/components/Header/header";
import { UserContext } from "./contexts/userContext";
import styles from "./page.module.css";
import LatestRequests from "@/app/components/LatestRequest/LatestRequest.jsx";

export default function Home() {
  const words = [
    "Bem-vindo ao Service Desk",
    "Agilidade e eficiência no suporte à infraestrutura do SENAI-Valinhos.",
  ];

  const typingAnimation = (i) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: i * 0.03, // Delay baseado na posição da letra (para digitar cada letra com intervalo)
        duration: 0.3, // A duração da animação de cada letra
      },
    },
  });

  const { user } = useContext(UserContext);

  return (
    <main className={styles.main}>
      <Header />
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroSection}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.title}>
              {words[0].split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={typingAnimation(index)}
                  initial="hidden"
                  animate="visible"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <p className={styles.subtitle}>
              {words[1].split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={typingAnimation(index + words[0].length)}
                  initial="hidden"
                  animate="visible"
                >
                  {letter}
                </motion.span>
              ))}
            </p>

            <Link href="./Request" className={styles.ctaButton}>
              Reportar Problema
            </Link>
          </motion.div>
        </div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.greeting}>
            Olá, {user ? user.name : "visitante"}!
          </h2>
          <p className={styles.description}>
            Seja bem-vindo ao Service Desk do SENAI-Valinhos! Aqui você pode
            reportar problemas e solicitar manutenções de forma prática e
            rápida.
          </p>
          <h3 className={styles.attention}>ATENÇÃO!</h3>
          <div className={styles.iconsContainer}>
            <div className={styles.iconCard}>
              <BsPencilSquare size={40} />
              <p>Escreva o assunto do problema</p>
            </div>
            <div className={styles.iconCard}>
              <GoTools size={40} />
              <p>Descreva o problema detalhadamente</p>
            </div>
            <div className={styles.iconCard}>
              <IoCamera size={40} />
              <p>Anexe uma foto do problema</p>
            </div>
            <div className={styles.iconCard}>
              <IoIosPin size={40} />
              <p>Informe a localização do problema</p>
            </div>
          </div>
        </motion.div>

        <LatestRequests /> 
      </motion.div>
    </main>
  );
}