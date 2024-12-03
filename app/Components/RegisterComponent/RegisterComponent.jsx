"use client";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "../../Register/register.module.css";
import { createUser } from "@/app/actions/users";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { UserContext } from "@/app/contexts/userContext";
import Image from "next/image";
const special = ["!", "@", "#", "$", "%", "&", "*", "(", ")", "/", "?", "|"];
const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const upper = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const lower = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const RegisterComponent = () => {
  const router = useRouter();

  const { user } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState("user");
  const [isStudent, setIsStudent] = useState("student");

  const verifyEmail = (email) => {
    const validDomains = ["sp.senai.br", "aluno.senai.br", "docente.senai.br"];
    const domain = email.split("@")[1];
    return validDomains.includes(domain);
  };

  const signUp = async (name, email, password, confirm, isAdmin, isStudent) => {
    if (!name || !email || !password) {
      toast.error("DADOS INCOMPLETOS");
    } else if (confirm !== password) {
      toast.error("SENHAS DISCREPANTES");
    } else if (password.length < 6) {
      toast.error("SENHA MUITO CURTA");
    } else if (name.length < 3) {
      toast.error("NOME MUITO CURTO");
    } else if (email.length < 10) {
      toast.error("EMAIL MUITO CURTO");
    } else if (!verifyEmail(email)) {
      toast.error("EMAIL INVÁLIDO");
    } else if (!password.split("").some((char) => special.includes(char))) {
      toast.error("SENHA DEVE CONTER CARACTERES ESPECIAIS");
    } else if (!password.split("").some((char) => lower.includes(char))) {
      toast.error("SENHA DEVE CONTER LETRAS MINUSCULAS");
    } else if (!password.split("").some((char) => upper.includes(char))) {
      toast.error("SENHA DEVE CONTER LETRAS MAIUSCULAS");
    } else if (!password.split("").some((char) => number.includes(char))) {
      toast.error("SENHA DEVE CONTER NÚMEROS");
    } else {
      const response = await createUser({
        name: name.toLowerCase(),
        email: email,
        password: password,
        isAdmin: isAdmin,
        isStudent: isStudent,
      });
      if (response.errors) {
        for (let i = 0; i < response.errors.length; i++) {
          toast.error(response.errors[i].split("_").join(" ").toUpperCase());
        }
      } else {
        if (response.error) {
          toast.error(response.error.toUpperCase());
          return false;
        }
        toast.success("USUÁRIO CADASTRADO");
        user && user.isadmin ? clearFields() : router.replace("/Login");
      }
    }
  };
  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsAdmin("");
    setIsStudent("");
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.bg}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Image
          src="/senai.png"
          alt="SENAI logo"
          width={300}
          height={70}
          layout="responsive"
          className={styles.logo}
        />
        <h1 className={styles.title}>Service Desk</h1>
      </motion.div>
      <motion.article
        className={styles.loginBox}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2
          className={styles.loginTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {user && user.isadmin ? "CADASTRAR" : "CADASTRE-SE"}
        </motion.h2>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            signUp(name, email, password, confirmPassword, isAdmin, isStudent);
          }}
        >
          {/* Campos de entrada e selects do formulário */}
          <section className={styles.inputField}>
            <label htmlFor="name" className={styles.label}>
              Nome:
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className={styles.input}
              onChange={(e) => setName(e.target.value)}
            />
          </section>

          <section className={styles.inputField}>
            <label htmlFor="email" className={styles.label}>
              Email:
            </label>
            <input
              type="text"
              name="email"
              value={email}
              className={styles.input}
              onChange={(e) => setEmail(e.target.value)}
            />
          </section>

          <section className={styles.inputField}>
            <label htmlFor="password" className={styles.label}>
              Senha:
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                className={styles.input}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FaEyeSlash fontSize={20} />
                ) : (
                  <FaEye fontSize={20} />
                )}
              </button>
            </div>
          </section>

          <section className={styles.inputField}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar senha:
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword2 ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                className={styles.input}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword2((prev) => !prev)}
              >
                {showPassword2 ? (
                  <FaEyeSlash fontSize={20} />
                ) : (
                  <FaEye fontSize={20} />
                )}
              </button>
            </div>
          </section>

          {user && user.isadmin && (
            <>
              <section className={styles.inputField}>
                <label htmlFor="isAdmin" className={styles.label}>
                  É administrador?
                </label>
                <select
                  name="isAdmin"
                  value={isAdmin}
                  className={styles.input}
                  onChange={(e) => setIsAdmin(e.target.value === "true")}
                >
                  <option value="admin">Sim</option>
                  <option value="user">Não</option>
                </select>
              </section>

              <section className={styles.inputField}>
                <label htmlFor="isStudent" className={styles.label}>
                  É aluno?
                </label>
                <select
                  name="isStudent"
                  value={isStudent}
                  className={styles.input}
                  onChange={(e) => setIsStudent(e.target.value)}
                >
                  <option value="student">Sim</option>
                  <option value="educator">Não</option>
                </select>
              </section>
            </>
          )}

          <section className={styles.btnLogin}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.btn}
            >
              CADASTRAR
            </motion.button>
          </section>
        </motion.form>
        {!user && (
          <motion.button
            className={styles.btnNoLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => router.replace("/Login")}
          >
            Já possui cadastro? Clique para login
          </motion.button>
        )}
      </motion.article>
    </div>
  );
};

export default RegisterComponent;