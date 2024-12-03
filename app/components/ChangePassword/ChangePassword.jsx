import toast from 'react-hot-toast';
import styles from './changePassword.module.css';
import { useEffect, useState } from 'react';
import { changePassword } from '@/app/actions/users';
import { useContext } from 'react';
import { UserContext } from '@/app/contexts/userContext';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {

    const { user, setUser } = useContext(UserContext);

    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [advice, setAdvice] = useState(false);

    const change = async () => {
        if (password !== confirmPassword) {
            setAdvice(true);
            return false;
        } else {
            const token = localStorage.getItem('refreshToken');
            const response = await changePassword(password, confirmPassword, user.email, token);
            if(response.error) {
                toast.error(response.error, { duration: 2000 });
            } else {
                toast.success("SENHA ALTERADA COM SUCESSO!");
                localStorage.clear();
                setUser(null);
                router.replace('/');
            }
        }

    }

    useEffect(() => {
        setTimeout(() => {
          setAdvice(false);
        }, 2000);
      }, []);

    return (
        <>
            <label htmlFor="newpassword">Nova senha: </label>
            <input
                type="password"
                name='newpassword'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
            />

            <label htmlFor="confirmpassword">Confirmar senha: </label>
            <input
                type="password"
                name='confirmpassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
            />

            {
                advice && <p style={{color: 'red'}}>As senhas não coincidem!</p>
            }

            <button className={styles.button} onClick={change}>MUDAR SENHA!</button>
        </>
    );
}

export default ChangePassword;