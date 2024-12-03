import React from 'react';
import styles from './card.module.css';

const Card = ({ data }) => {
  return (
    <div className={styles.card}>
      {Object.keys(data).map((key, index) => (
        <div key={index} className={styles.cardItem}>
          <strong>{key.toUpperCase()}:</strong> {data[key]}
        </div>
      ))}
    </div>
  );
};

export default Card;