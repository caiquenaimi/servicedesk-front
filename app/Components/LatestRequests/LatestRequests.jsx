import { useEffect, useState } from "react";
import styles from "../../page.module.css";
import { getAllRequests } from "@/app/actions/request";
import format from "@/app/utilities/formattedDate";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

export default function LatestRequests() {
  const [latestRequests, setLatestRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleRequestPage = () => {
    router.push("/Request");
  };

  useEffect(() => {
    const fetchLatestRequests = async () => {
      setLoading(true);
      try {
        const data = await getAllRequests();
        if (data.requests) {
          const sortedRequests = data.requests.sort(
            (a, b) => new Date(b.date_request) - new Date(a.date_request)
          );
          setLatestRequests(sortedRequests.slice(0, 3));
        }
      } catch (e) {
        console.error("Erro ao carregar as últimas requisições:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRequests();
  }, []);

  return (
    <motion.section
      className={styles.latestRequests}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.title}>Últimas Requisições</h2>
      {loading ? (
        <div className={styles.loading}>
          <TailSpin
            wrapperStyle={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            color="#ff0000"
            height={200}
            width={100}
          />
        </div>
      ) : latestRequests.length > 0 ? (
        <div className={styles.cardsContainer}>
          {latestRequests.map((request) => (
            <motion.div
              key={request.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={request.image}
                alt={request.local}
                className={styles.image}
              />
              <h3 className={styles.cardTitle}>{request.local}</h3>
              <p className={styles.cardDescription}>{request.description}</p>
              <div className={styles.cardFooter}>
                <p className={styles.cardDetails}>
                  <strong>Feito por:</strong> {request.email}
                </p>
                <p className={styles.cardDate}>
                  <strong>Data:</strong> {format(request.date_request)}
                </p>
                <div className={styles.cardStatus}>
                  <div className={styles.status}>
                    {request.status_request === "aguardando" && (
                      <p className={styles.awaiting}>Aguardando</p>
                    )}
                    {request.status_request === "em andamento" && (
                      <p className={styles.inProgress}>Em andamento</p>
                    )}
                    {request.status_request === "concluida" && (
                      <p className={styles.concluded}>Concluída</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className={styles.noRequests}>Nenhuma requisição encontrada.</p>
      )}

      <button className={styles.seeAllButton} onClick={handleRequestPage}>
        Ver todas as requisições
      </button>
    </motion.section>
  );
}
