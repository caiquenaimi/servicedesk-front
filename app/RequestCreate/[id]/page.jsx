import { Header } from '@/app/components/Header/header';
import styles from './edit.module.css';
import EditComponent from '@/app/components/Edit/Edit';

export default function EditRequest({ params }) {

    const { id } = params;

    return (
        <main className={styles.generalDiv}>
            <Header />
            <div className={styles.component}>
                <EditComponent id={id} />
            </div>
        </main>
    );
}