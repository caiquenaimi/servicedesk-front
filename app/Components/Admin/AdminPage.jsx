import styles from "./adminpage.module.css";
import toast from "react-hot-toast";
import Table from "../Table/Table";
import Card from "../Card/Card";
import { useState, useEffect } from "react";
import { getAllUsers, getUserByName, getUserByRole } from "@/app/actions/users";
import {
  getAllRequests,
  getLocais,
  getRequestByStatus,
  getRequestsByName,
  getRequestByCreationDate,
  getRequestByFinishDate,
  getRequestByUser,
  getRequestByLocal,
  getRequestsByPriority,
} from "@/app/actions/request";
import format from "@/app/utilities/formattedDate";
import Modal from "../Modal/Modal";
import ChangePassword from "../ChangePassword/ChangePassword";
import { motion } from "framer-motion"; // Importando o framer-motion
import { getAllDataRequests } from "@/app/actions/data";
import DataRequest from "../Data/DataRequest";

const AdminPage = () => {
  //para pesquisa
  const [typeSearch, setTypeSearch] = useState("user");
  const [name, setName] = useState("");
  const [optionSearch, setOptionSearch] = useState("name");
  const [option, setOption] = useState("");
  const [creation, setCreation] = useState("");
  const [finish, setFinish] = useState("");
  const [byUser, setByUser] = useState("");

  //for edit
  const [edit, setEdit] = useState(false);

  //resposta para tabela
  const [response, setResponse] = useState([]);
  const [responseCard, setResponseCard] = useState([]);
  const [locals, setLocals] = useState([]);

  //para as estatisticas
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllDataRequests();
        setData(response);
      } catch (e) {
        toast.error(e, { duration: 2000 });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      let result;
      if (optionSearch == "name") {
        name.trim()
          ? (result = await getUserByName(name))
          : (result = await getAllUsers());
      } else if (optionSearch == "role") {
        option.trim()
          ? (result = await getUserByRole(option))
          : (result = await getAllUsers());
      } else {
        result = await getAllUsers();
      }

      if (!result.users) {
        setResponse([]);
        setResponseCard([]);
        if (result.message) {
          toast.error(result.message, { duration: 3000 });
          return false;
        } else {
          return false;
        }
      }

      setResponse(
        result.users.map((user) => ({
          0: user.name,
          1: user.email,
          2: user.isstudent ? "estudante" : "funcionário",
          3: user.isadmin ? "administrador" : "usuário",
        }))
      );

      setResponseCard(
        result.users.map((user) => ({
          nome: user.name,
          email: user.email,
          função: user.isstudent ? "estudante" : "funcionário",
          acesso: user.isadmin ? "administrador" : "usuário",
        }))
      );
    };

    const fetchReqs = async () => {
      const localsBack = await getLocais();
      if (localsBack.locais) setLocals(localsBack.locais);

      let result;
      if (optionSearch == "name")
        name.trim()
          ? (result = await getRequestsByName(name))
          : (result = await getAllRequests());
      else if (optionSearch == "local")
        option.trim()
          ? (result = await getRequestByLocal(option))
          : (result = await getAllRequests());
      else if (optionSearch == "status")
        option.trim()
          ? (result = await getRequestByStatus(option))
          : (result = await getAllRequests());
      else if (optionSearch == "create")
        creation.trim()
          ? (result = await getRequestByCreationDate(creation))
          : (result = await getAllRequests());
      else if (optionSearch == "finish")
        finish.trim()
          ? (result = await getRequestByFinishDate(finish))
          : (result = await getAllRequests());
      else if (optionSearch == "user")
        byUser.trim()
          ? (result = await getRequestByUser(byUser))
          : (result = await getAllRequests());
      else if (optionSearch == "priority")
        option.trim()
          ? (result = await getRequestsByPriority(option))
          : (result = await getAllRequests());
      else result = await getAllRequests();

      console.log(optionSearch);
      console.log(option);
      console.log(result);

      if (!result.requests) {
        setResponse([]);
        setResponseCard([]);
        if (result.message) {
          toast.error(result.message, { duration: 3000 });
          return false;
        } else {
          return false;
        }
      }

      setResponse(
        result.requests.map((request) => ({
          0: request.title,
          1: request.local,
          2: request.status_request,
          3: format(request.date_request),
          4: format(request.date_conclusion),
          5: request.email,
          6: request.priority,
        }))
      );

      setResponseCard(
        result.requests.map((request) => ({
          título: request.title,
          local: request.local,
          status: request.status_request,
          "dia criado": format(request.date_request),
          "dia finalizado": format(request.date_conclusion),
          usuário: request.email,
          prioridade: request.priority,
        }))
      );
    };

    typeSearch == "user" ? fetchUsers() : fetchReqs();
  }, [name, option, optionSearch, creation, finish, typeSearch, byUser]);

  const months = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
  };

  return (
    <article className={styles.container}>
      <motion.section
        className={styles.data}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {data && (
          <motion.div
            className={styles.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DataRequest
              month={months[data.last_month.split("-")[1]]}
              requests={data.reqs_last_month}
              attented={data.attended_reqs_last_month}
            />
            <DataRequest
              month={months[data.this_month.split("-")[1]]}
              requests={data.reqs_this_month}
              attented={data.attended_reqs_this_month}
            />
          </motion.div>
        )}
      </motion.section>
      <motion.section
        className={styles.filters}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.options}>
          <motion.div
            className={styles.search}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3>FILTRO:</h3>
            <div className={styles.typeSearch}>
              <label htmlFor="type">Usuário: </label>
              <input
                name="type"
                type="radio"
                value="user"
                checked={typeSearch === "user"}
                onChange={(e) => setTypeSearch(e.target.value)}
              />

              <label htmlFor="type">Requisições: </label>
              <input
                name="type"
                type="radio"
                value="reqs"
                checked={typeSearch === "reqs"}
                onChange={(e) => setTypeSearch(e.target.value)}
              />
            </div>
            {optionSearch == "name" && (
              <>
                <label htmlFor="name">
                  {typeSearch == "user" ? "Nome: " : "Título: "}
                </label>
                <input
                  name="name"
                  className={styles.inputSearch}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </>
            )}
            {typeSearch == "user" ? (
              optionSearch == "role" && (
                <>
                  <label htmlFor="role">Função: </label>
                  <select
                    name="role"
                    className={styles.inputSearch}
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="student">Estudantes</option>
                    <option value="educator">Funcionários</option>
                  </select>
                </>
              )
            ) : (
              <>
                {optionSearch == "local" && (
                  <>
                    <label htmlFor="choice">Por local:</label>
                    <select
                      name="choice"
                      className={styles.inputSearch}
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {locals.map((local) => (
                        <option key={local.id} value={local.nome}>
                          {local.nome}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {optionSearch == "status" && (
                  <>
                    <label htmlFor="choice">Qual o status:</label>
                    <select
                      name="choice"
                      className={styles.inputSearch}
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      <option value="conclued">Concluído</option>
                      <option value="awaiting">Em andamento</option>
                      <option value="inconclued">Aguardando manutenção</option>
                    </select>
                  </>
                )}
                {optionSearch == "create" && (
                  <>
                    <label htmlFor="create-date">Data de criação: </label>
                    <input
                      name="create-date"
                      type="date"
                      className={styles.inputSearch}
                      value={creation}
                      onChange={(e) => setCreation(e.target.value)}
                    />
                  </>
                )}
                {optionSearch == "finish" && (
                  <>
                    <label htmlFor="finish-date">Data de finalização: </label>
                    <input
                      name="finish-date"
                      type="date"
                      className={styles.inputSearch}
                      value={finish}
                      onChange={(e) => setFinish(e.target.value)}
                    />
                  </>
                )}
                {optionSearch == "user" && (
                  <>
                    <label htmlFor="user">Usuário</label>
                    <input
                      name="user"
                      className={styles.inputSearch}
                      value={byUser}
                      onChange={(e) => setByUser(e.target.value)}
                    />
                  </>
                )}
                {optionSearch == "priority" && (
                  <>
                    <label htmlFor="choice">Qual a prioridade:</label>
                    <select
                      name="choice"
                      className={styles.inputSearch}
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      <option value="high">Alta</option>
                      <option value="medium">Média</option>
                      <option value="low">Baixa</option>
                    </select>
                  </>
                )}
              </>
            )}
          </motion.div>
          <motion.div
            className={styles.choice}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label htmlFor="choice">
              {typeSearch == "user" ? "Por nome: " : "Por título: "}
            </label>
            <input
              name="choice"
              type="radio"
              value="name"
              checked={optionSearch === "name"}
              onChange={(e) => setOptionSearch(e.target.value)}
            />
            {typeSearch == "user" ? (
              <>
                <label htmlFor="choice">Por Função:</label>
                <input
                  name="choice"
                  type="radio"
                  value="role"
                  checked={optionSearch === "role"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
              </>
            ) : (
              <>
                <label htmlFor="choice">Por local:</label>
                <input
                  name="choice"
                  type="radio"
                  value="local"
                  checked={optionSearch === "local"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
                <label htmlFor="choice">Por status:</label>
                <input
                  name="choice"
                  type="radio"
                  value="status"
                  checked={optionSearch === "status"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
                <label htmlFor="choice">Por data de criação:</label>
                <input
                  name="choice"
                  type="radio"
                  value="create"
                  checked={optionSearch === "create"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
                <label htmlFor="choice">Por data de finalização:</label>
                <input
                  name="choice"
                  type="radio"
                  value="finish"
                  checked={optionSearch === "finish"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
                <label htmlFor="choice">Por usuário:</label>
                <input
                  name="choice"
                  type="radio"
                  value="user"
                  checked={optionSearch === "user"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
                <label htmlFor="choice">Por prioridade:</label>
                <input
                  name="choice"
                  type="radio"
                  value="priority"
                  checked={optionSearch === "priority"}
                  onChange={(e) => setOptionSearch(e.target.value)}
                />
              </>
            )}
          </motion.div>
        </div>
        <motion.button
          className={styles.button}
          onClick={() => setEdit(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Mudar senha
        </motion.button>
      </motion.section>

      <motion.section
        className={styles.table}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {typeSearch == "user" ? (
          <Table
            atributtes={["nome", "email", "função", "acesso"]}
            content={response}
          />
        ) : (
          <Table
            atributtes={[
              "título",
              "local",
              "status",
              "dia criado",
              "dia finalizado",
              "usuário",
              "prioridade",
            ]}
            content={response}
          />
        )}
      </motion.section>

      <motion.section
        className={styles.cards}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {responseCard.map((data, index) => (
          <Card key={index} data={data} />
        ))}
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
};

export default AdminPage;
