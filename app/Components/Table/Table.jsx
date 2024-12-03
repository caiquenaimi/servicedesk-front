import toast from "react-hot-toast";
import styles from "./table.module.css";

const Table = ({ atributtes, content }) => {
  if (!content || content.length === 0) {
    return <p className={styles.none}>Nenhum resultado encontrado</p>;
  }

  return (
    <table className={styles.container}>
      <thead>
        <tr className={styles.trow}>
          {atributtes.map((attribute, index) => (
            <th className={styles.theader} key={index}>
              {attribute.toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {content.map((obj, index) => (
          <tr key={index} className={styles.trow}>
            {Object.keys(obj).map((key, i) => (
              <td className={styles.tdata} key={i}>
                {obj[key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;