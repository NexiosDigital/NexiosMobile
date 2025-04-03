import axios from "axios";
import { API_URL } from "../constants/endpoints";

/**
 * Faz upload de um arquivo para o servidor
 * @param {Object} file - Objeto de arquivo com uri, type, name e size
 * @param {string} conversationId - ID da conversa atual (opcional)
 * @returns {Promise} - Resposta da API com URL do arquivo
 */
export const uploadFile = async (file, conversationId = null) => {
	try {
		console.log(`Iniciando upload de arquivo: ${file.name}`);

		// Criar FormData para envio do arquivo
		const formData = new FormData();
		formData.append("file", {
			uri: file.uri,
			type: file.type,
			name: file.name,
		});

		// Adicionar ID da conversa se disponível
		if (conversationId) {
			formData.append("conversation_id", conversationId);
		}

		// Fazer requisição para o endpoint de upload
		const response = await axios.post(`${API_URL}/api/upload`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			timeout: 30000, // 30 segundos para uploads
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				console.log(`Upload progresso: ${percentCompleted}%`);
			},
		});

		console.log("Upload concluído:", response.data);
		return response.data;
	} catch (error) {
		console.error("Erro ao fazer upload:", error);

		// Log detalhado do erro
		if (error.response) {
			console.error("Resposta de erro:", {
				status: error.response.status,
				data: error.response.data,
			});
		} else if (error.request) {
			console.error("Sem resposta do servidor:", error.request);
		} else {
			console.error("Erro de configuração:", error.message);
		}

		throw error;
	}
};
