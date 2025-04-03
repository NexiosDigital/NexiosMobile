import axios from "axios";
import { API_URL } from "../constants/endpoints";

// Cliente axios com configuração base
const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 15000, // 15 segundos
});

/**
 * Enviar mensagem para o backend
 * @param {string} message - Mensagem do usuário
 * @param {Array} conversationHistory - Histórico da conversa
 * @param {string} conversationId - ID da conversa (opcional)
 * @returns {Promise} - Resposta da API
 */
export const sendMessage = async (
	message,
	conversationHistory = [],
	conversationId = null
) => {
	try {
		console.log(`Enviando mensagem para o backend...`);
		console.log(`URL da API: ${API_URL}/api/chat-n8n`);

		// Usar endpoint chat-n8n que utiliza o webhook do N8N
		const response = await apiClient.post("/api/chat-n8n", {
			message,
			conversation_history: conversationHistory.map((msg) => ({
				role: msg.role,
				content: msg.content,
			})),
			conversation_id: conversationId,
		});

		console.log("Resposta do servidor:", response.data);
		return response.data;
	} catch (error) {
		console.error("Erro ao enviar mensagem:", error);

		// Log mais detalhado do erro
		if (error.response) {
			// O servidor respondeu com um status de erro
			console.error("Resposta de erro:", {
				status: error.response.status,
				data: error.response.data,
			});
		} else if (error.request) {
			// A requisição foi feita mas não houve resposta
			console.error("Sem resposta do servidor:", error.request);
		} else {
			// Erro na configuração da requisição
			console.error("Erro de configuração:", error.message);
		}

		throw error;
	}
};

/**
 * Verificar o status da API
 * @returns {Promise} - Status da API
 */
export const checkConnectionStatus = async () => {
	try {
		console.log("Verificando status da API...");
		const response = await apiClient.get("/api/status");

		console.log("Resposta da verificação de status:", response.data);
		return response.data;
	} catch (error) {
		console.error("Erro ao verificar status da API:", error);
		throw error;
	}
};

/**
 * Recuperar histórico de mensagens para uma conversa
 * @param {string} conversationId - ID da conversa
 * @returns {Promise} - Histórico de mensagens
 */
export const getMessages = async (conversationId) => {
	try {
		console.log(`Recuperando mensagens para conversa ${conversationId}...`);

		// Adicionar parâmetro para evitar cache
		const cacheBuster = Date.now();

		const response = await apiClient.get(
			`/api/messages/${conversationId}?cacheBuster=${cacheBuster}`,
			{
				headers: {
					"Cache-Control": "no-cache, no-store, must-revalidate",
					Pragma: "no-cache",
				},
			}
		);

		console.log(`Recebidas ${response.data.messages?.length || 0} mensagens`);
		return response.data;
	} catch (error) {
		console.error("Erro ao recuperar mensagens:", error);
		throw error;
	}
};
