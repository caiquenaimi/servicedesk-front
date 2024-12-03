import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './userPage.module.css';
import { UserContext } from '@/app/contexts/userContext';
import { compare, getUserByEmail, updateUser } from '@/app/actions/users';
import Modal from '../Modal/Modal';
import ChangePassword from '../ChangePassword/ChangePassword';
import { motion } from 'framer-motion'; // Importando o framer-motion

const UserPage = () => {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [email, setEmail] = useState(user.email);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(user.name);

    useEffect(() => {
        const showEmail = () => {
            let [localPart, domain] = email.split('@');
            let localChars = localPart.split('');
            for (let i = 3; i < localChars.length; i++) {
                localChars[i] = '*';
            }
            let response = localChars.join('') + '@' + domain;
            setEmail(response);
        }
        showEmail();
    }, []);

    useEffect(() => {
        setName(user.name.toUpperCase());
    }, [edit]);

    const logoff = () => {
        setUser(null);
        localStorage.clear();
        router.replace('/');
    }

    return (
        <article className={styles.container}>
            <motion.section
                className={styles.info}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className={styles.content}>
                    <motion.h2
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        SEJA BEM-VINDO, {user.name.split(' ')[0].toUpperCase()}!
                    </motion.h2>

                    <motion.label
                        className={styles.labelfor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Nome:
                    </motion.label>
                    <motion.input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        readOnly
                        className={styles.inputUser}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    />

                    <motion.label
                        className={styles.labelfor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        Email:
                    </motion.label>
                    <motion.input
                        type="text"
                        value={email}
                        onChange={(e) => setPassword(e.target.value)}
                        readOnly
                        className={styles.inputUser}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    />

                    <motion.label
                        className={styles.labelfor}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        Senha:
                    </motion.label>
                    <motion.input
                        type='password'
                        value={'*****************'}
                        readOnly
                        className={styles.inputUser}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                    />

                    <motion.button
                        className={styles.button}
                        onClick={() => setEdit(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        Editar
                    </motion.button>
                </div>
            </motion.section>

            {edit && (
                <Modal isOpen={edit} closeModal={() => setEdit(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className={styles.modalContent}
                    >
                        <ChangePassword />
                    </motion.div>
                </Modal>
            )}
        </article>
    );
}

export default UserPage;