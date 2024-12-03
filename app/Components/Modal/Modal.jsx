import styles from './modal.module.css'

const Modal = ({ closeModal, isOpen, children }) => {

    if(!isOpen) {
        return null;
    }

    return(
        <>
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.header}>
                        <button className={styles.close} onClick={() => closeModal(false)}>X</button>
                    </div>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;