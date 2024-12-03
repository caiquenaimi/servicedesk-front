"use client";
import styles from './editComponent.module.css';
import { useState, useEffect, useContext } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { getLocais, getRequestById, updateRequest } from "@/app/actions/request";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/contexts/userContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { MdImageNotSupported } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";


const EditComponent = ({ id }) => {

  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [local, setLocal] = useState("");
  const [priority, setPriority] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(null);
  const router = useRouter();
  const validFileTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  const formattedId = id.split('%')[0];

  useEffect(() => {
    if (!user) {
      router.replace("/Login");
    } else {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchLocais = async () => {
      const locaisData = await getLocais();
      if (Array.isArray(locaisData.locais)) {
        setLocais(locaisData.locais);
      } else {
        console.error("Dados de locais inválidos:", locaisData);
        toast.error("Erro ao carregar locais");
      }
    };

    fetchLocais();
  }, []);

  useEffect(() => {
    const fetchReq = async () => {
      try {
        setLoading(true);
        const response = await getRequestById(formattedId);
        if (response.error) {
          toast.error('Não foi possível encontrar sua requisição', { duration: 3000 });
          router.replace('/');
        } else {
          setRequest(response);
          fillFields(response);
        }
      } catch (e) {
        toast.error('Não foi possível encontrar sua requisição', { duration: 3000 });
        router.replace('/');
      } finally {
        setLoading(false);
      }
    }

    fetchReq();
  }, []);

  const fillFields = (data) => {
    console.log(data);
    setTitle(data.title);
    setDescription(data.description);
    setLocal(data.local);
    setOriginalImage(data.image);
    setImagePreview(data.image);
    switch (data.priority) {
      case 'alta':
        setPriority('high');
        break;
      case 'média':
        setPriority('medium');
        break; 
      default:
        setPriority('low');
        break;
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (!validFileTypes.includes(file.type)) {
      toast.error("Arquivo deve estar em formato JPG/PNG");
      return;
    }

    // Cria a pré-visualização da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const convertToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const editRequest = async (title, description, local, image) => {

    // if (!title || !description || !local || !image) {
    //   toast.error("PREENCHA TODOS OS CAMPOS");
    //   return;
    // } else
     if (title.length < 3) {
      toast.error("TÍTULO MUITO LONGO MIN 3 MAX 35 CARACTERES");
      return;
    } else if (title.length > 35) {
      toast.error("TÍTULO MUITO LONGO MIN 3 MAX 35 CARACTERES");
      return;
    } else if (description.length < 10) {
      toast.error("DESCRIÇÃO MUITO CURTA");
      return;
    } else if(!imagePreview) {
      toast.error("INSIRA UMA IMAGEM");
      return;
    }


    try {
      setLoading(true);


      let statusRequest;
      switch (request.status_request.toLowerCase()) {
        case "em andamento":
          statusRequest = "awaiting";
          break;
        case "aguardando":
          statusRequest = "inconclued";
          break;
        default:
          toast.error('STATUS INVÁLIDO', { duration: 3000 });
          break;
      }
      let imageBoolean;
      let requestData = {
        title,
        description,
          local,
        };
  
        if (image) {
          imageBoolean = false;
          const imageArrayBuffer = await convertToArrayBuffer(image);
          requestData = {
            ...requestData,
            image: Array.from(new Uint8Array(imageArrayBuffer)),
            imageName: image.name,
            imageType: image.type,
          };
        } else {
          imageBoolean = true;
          requestData = {
            ...requestData,
            image: originalImage,
          };
        }
  
        requestData = {
          ...requestData,
          imageBoolean : imageBoolean,
          status_request: statusRequest,
          date_request: request.date_request,
          date_conclusion: null,
          priority: priority,
          email,
      };
      const token = localStorage.getItem("refreshToken");
      const response = await updateRequest(formattedId, requestData, token);

      if (response.success) {
        toast.success("REQUISIÇÃO ALTERADA");
        router.replace("/Request");
        return;
      }
      console.error("Erro do servidor:", response);
      toast.error(response.errors || "Erro ao criar requisição");
      return;
    } catch (error) {
      console.error("Erro do lado do cliente:", error);
      toast.error('OPERAÇÃO FALHOU');
    } finally {
      setLoading(false);
    }
  };

  // const fetchImageAsArrayBuffer = async (url) => {
  //   try {
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Erro ao baixar a imagem");
  //     }
  //     return await response.arrayBuffer();
  //   } catch (error) {
  //     console.error("Erro ao processar imagem:", error);
  //     throw error;
  //   }
  // };

  return (
    <ProtectedRoute>
      {
        loading ? (
          <div className={styles.loading}>
            <p className={styles.loadingtxt}>Alterando requisição...</p>
            <TailSpin
              height="80"
              width="80"
              color="#ff0000"
              ariaLabel="tail-spin-loading"
            />
          </div>
        ) : (
          <motion.div
            className={styles.main}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.title}>
              Edite o seu <span className={styles.problemText}>problema</span>
            </h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editRequest(title, description, local, image);
              }}
            >
              <motion.label
                className={styles.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Assunto:
              </motion.label>
              <motion.input
                type="text"
                className={styles.titleInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <motion.label
                className={styles.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                O que aconteceu? Descreva
              </motion.label>
              <motion.textarea
                className={styles.descriptionInput}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              <motion.label
                className={styles.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Imagem
              </motion.label>
              {!imagePreview ? (
                <div
                  className={styles.imageUpload}
                  onClick={() =>
                    document.querySelector(`.${styles.fileInput}`).click()
                  }
                >
                  <input
                    type="file"
                    name="image"
                    onChange={handleUpload}
                    className={styles.fileInput}
                    accept="image/*"
                  />
                  <IoCloudDownloadOutline color="#000" fontSize={30} />
                  <span>Inserir imagem</span>
                </div>
              ) : (
                <motion.div
                  className={styles.imagePreviewContainer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={imagePreview}
                    alt="Imagem Preview"
                    className={styles.imagePreview}
                  />
                </motion.div>
              )}
              {imagePreview && (
                <div className={styles.removeImageButtonDiv}>
                  <button
                    className={styles.removeImageButton}
                    onClick={() => {
                      setImagePreview(null);
                      setImage(null);
                    }}
                  >
                    <MdImageNotSupported size={20} />

                    <p className={styles.removeImageText}>Remover imagem</p>
                  </button>
                </div>
              )}

              <motion.label
                className={styles.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Qual foi o local?
              </motion.label>
              <motion.select
                className={styles.select}
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <option value="">Selecione o ambiente</option>
                {locais.map((localItem) => (
                  <option key={localItem.id} value={localItem.nome}>
                    {localItem.nome}
                  </option>
                ))}
              </motion.select>

              <motion.label
                className={styles.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                Qual a prioridade?
              </motion.label>

              <motion.select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <option value="">Selecione...</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </motion.select>

              <motion.button
                className={styles.submitButton}
                type="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Atualizar
              </motion.button>
            </form>
          </motion.div>
        )
      }
    </ProtectedRoute>
  );
}

export default EditComponent;