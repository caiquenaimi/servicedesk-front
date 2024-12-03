"use client";
import { useEffect, useState, useContext } from "react";
import styles from "./requestComponent.module.css";
import toast from "react-hot-toast";
import { TailSpin } from "react-loader-spinner";
import RenderTest from "../RenderTest/RenderTest";
import {
  getAllRequests,
  deleteRequest,
  getRequestById,
  updateStatus,
} from "@/app/actions/request";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserContext } from "@/app/contexts/userContext";
import Image from "next/image";
import format from "@/app/utilities/formattedDate";
import { IoTrashOutline } from "react-icons/io5";
import { FaWindowClose } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LuPencil } from "react-icons/lu";

export default function RequestComponent() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchRequests = async () => {
      try {
        const data = await getAllRequests();
        if (data.requests) {
          setRequests(data.requests);
        } else {
          toast.error(data.success.toUpperCase());
        }
      } catch (e) {
        toast.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user, router]);

  const handleDeleteRequest = async (id) => {
    try {
      await deleteRequest(id);
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== id)
      );
      setRequest(null);
      toast.success("Requisição excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar requisição:", error);
      toast.error("Erro ao excluir requisição");
    } finally {
      setModalVisible(false);
    }
  };

  const openModal = (id) => {
    setSelectedRequestId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequestId(null);
  };

  const handleRequestCreate = () => {
    if (!user) {
      toast.error("Você precisa estar logado para acessar essa página");
      router.push("/Login");
      return;
    }
    router.push("/RequestCreate");
  };

  const sortedRequests = [...requests].sort(
    (a, b) =>
      (a.status_request === "aguardando" ? -1 : 0) -
      (b.status_request === "aguardando" ? -1 : 0)
  );

  sortedRequests.sort((a, b) =>
    a.status_request === "concluida"
      ? 1
      : b.status_request === "concluida"
      ? -1
      : 0
  );

  const handleRequest = async (id) => {
    try {
      const response = await getRequestById(id);
      setRequest(response);

      setTimeout(() => {
        const detailSection = document.querySelector(`.${styles.info}`);
        if (detailSection) {
          detailSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100); 
    } catch (e) {
      toast.error(e.message || e.error);
    }
  };

  const changeStatus = async (id, status, email) => {
    try {
      const request = await getRequestById(id);
      const token = localStorage.getItem("refreshToken");
      await updateStatus(id, status, email, token);
      if (request) {
        const response = await getAllRequests();
        setRequests(response.requests);
        const requestUpdated = await getRequestById(id);
        setRequest(requestUpdated);
      }
    } catch (e) {
      toast.error("ERRO EM ALTERAR STATUS");
    }
  };

  const generatePDF = async (item) => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");

      // Captura o conteúdo do elemento HTML
      const input = document.getElementById("request-detail");
      if (!input) {
        console.error("Elemento 'request-detail' não encontrado");
        return;
      }

      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 30, 180, 100);

      // Título principal do PDF
      doc.setFontSize(16);
      doc.text("Detalhes da Requisição", 105, 140, { align: "center" });

      doc.setFontSize(12);

      // Campos dinâmicos do item
      const fields = [
        { label: "Título da requisição:", value: item.title, offsetY: 160 },
        { label: "Descrição:", value: item.description, offsetY: 175 },
        { label: "Local:", value: item.local, offsetY: 190 },
        { label: "Status:", value: item.status_request, offsetY: 205 },
        {
          label: "Data da solicitação:",
          value: format(item.date_request),
          offsetY: 220,
        },
        { label: "Prioridade:", value: item.priority, offsetY: 228 },
      ];

      if (item.status_request === "concluida") {
        fields.push({
          label: "Data da conclusão:",
          value: format(item.date_conclusion),
          offsetY: 235,
        });
      }

      fields.push({ label: "Email:", value: item.email, offsetY: 250 });

      // Renderiza campos no PDF
      fields.forEach((field, index) => {
        if (field.value) {
          const yOffset = field.offsetY + index * 3; // Ajusta a posição Y
          doc.text(field.label, 10, yOffset);
          doc.setFont("helvetica", "normal");
          doc.text(field.value, 10, yOffset + 5);
        }
      });

      // Rodapé com informações dinâmicas
      const pageHeight = doc.internal.pageSize.height;
      const currentDate = new Date().toLocaleDateString();

      doc.setFontSize(10);
      doc.text(`Gerado em: ${currentDate}`, 10, pageHeight - 10);
      doc.text(
        `Solicitação: ${item.title || item.local || "Desconhecida"}`,
        105,
        pageHeight - 10,
        { align: "center" }
      );

      // Salva o PDF com o título ou local da requisição
      doc.save(`${item.title || item.local || "Requisicao"}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Tente novamente.");
    }
  };

  return (
    <article className={styles.container}>
      {modalVisible && (
        <div className={styles.modalOverlay}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className={styles.modal}
          >
            <p>Tem certeza de que deseja excluir esta solicitação?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalButtonConfirm}
                onClick={() => handleDeleteRequest(selectedRequestId)}
              >
                SIM
              </button>
              <button className={styles.modalButtonCancel} onClick={closeModal}>
                NÃO
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.section
        className={styles.filters}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className={styles.h1}>Gestão de Requisições</h1>
      </motion.section>

      <motion.section
        className={styles.requestButton}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <button className={styles.buttonRequest} onClick={handleRequestCreate}>
          Adicionar Requisição
        </button>
      </motion.section>
      <div className={styles.tooCards}>
        <motion.section
          className={styles.table}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className={styles.requestScroll}>
            {loading ? (
              <div className={styles.loading}>
                <TailSpin
                  height="80"
                  width="80"
                  color="#ff0000"
                  ariaLabel="tail-spin-loading"
                />
              </div>
            ) : sortedRequests.length !== 0 ? (
              <>
                {sortedRequests.map((item) => (
                  <motion.div
                    key={item.id || item.local}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    onClick={() => handleRequest(item.id)}
                    className={styles.requestCard}
                  >
                    <RenderTest
                      key={item.id || item.local}
                      local={item.local}
                      desc={item.description}
                      autor={item.email}
                      title={item.title}
                      image={item.image}
                      status={item.status_request}
                      priority={item.priority}
                    />
                  </motion.div>
                ))}
              </>
            ) : (
              <div className={styles.noRequestMsgDiv}>
                <p className={styles.noRequestMsg}>
                  REALIZE ALGUMA REQUISIÇÃO!
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {request && (
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className={styles.about}>
              <div className={styles.buttons}>
                <button
                  className={styles.btnRemovex}
                  onClick={() => setRequest(null)}
                >
                  <FaWindowClose fontSize={50} color={"red"} />
                </button>
              </div>
              <h2 className={styles.title}>{request.title}</h2>
              <div className={styles.imageContainer} id="request-detail">
                <Image
                  className={styles.imagex}
                  src={request.image}
                  width={370}
                  height={300}
                  alt="image-request"
                />
              </div>
              <p className={styles.details}>
                feito por: {request.email} em {format(request.date_request)}
              </p>
              <p className={styles.location}>{request.local}</p>
              <p className={styles.description}>{request.description}</p>
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
              <span className={styles.priority}>
                PRIORIDADE: {request.priority.toUpperCase()}
              </span>

              {user && user.isadmin && (
                <>
                  {request.status_request === "aguardando" && (
                    <button
                      className={styles.buttonr}
                      onClick={() =>
                        changeStatus(request.id, "awaiting", request.email)
                      }
                    >
                      INICIAR SOLICITAÇÃO
                    </button>
                  )}
                  {request.status_request === "em andamento" && (
                    <button
                      className={styles.buttonra}
                      onClick={() =>
                        changeStatus(request.id, "conclued", request.email)
                      }
                    >
                      <span> FINALIZAR SOLICITAÇÃO</span>
                    </button>
                  )}
                  {request.status_request === "concluida" && (
                    <button
                      className={styles.buttonrc}
                      onClick={() =>
                        changeStatus(request.id, "awaiting", request.email)
                      }
                    >
                      CORRIGIR SOLICITAÇÃO
                    </button>
                  )}
                </>
              )}
              {(user?.email && request.email === user.email) ||
              user?.isadmin ? (
                <div className={styles.buttonsdelete}>
                  <button
                    className={styles.btnRemove}
                    onClick={() => openModal(request.id)}
                  >
                    <IoTrashOutline fontSize={40} />
                  </button>
                </div>
              ) : null}

              {((user?.email &&
                request.email === user.email &&
                request.status_request === "aguardando") ||
                (user?.isadmin && request.status_request !== "concluida")) && (
                <div className={styles.buttonsEdit}>
                  <button
                    className={styles.btnEdit}
                    onClick={() =>
                      router.replace(`/RequestCreate/${request.id}}`)
                    }
                  >
                    <LuPencil fontSize={35} />
                  </button>
                </div>
              )}

              {request.status_request === "concluida" && (
                <p className={styles.dateConclusion}>
                  finalizada em: {format(request.date_conclusion)}
                </p>
              )}
              {(user?.email && request.email === user.email) ||
              user?.isadmin ? (
                <button
                  className={styles.exportButton}
                  onClick={() => generatePDF(request)}
                  title="Exportar para PDF"
                >
                  Baixar PDF
                  <p>
                    <FaFilePdf fontSize={20} />
                  </p>
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </div>
    </article>
  );
}