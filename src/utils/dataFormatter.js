/**
 * Formata uma data ISO em formato de hora legível
 * @param {string} isoString - Data em formato ISO
 * @returns {string} - Hora formatada (ex: "14:30")
 */
export const formatMessageTime = (isoString) => {
	if (!isoString) return "";

	try {
		const date = new Date(isoString);

		// Verificar se a data é válida
		if (isNaN(date.getTime())) return "";

		// Se a mensagem for de hoje, mostrar apenas a hora
		if (isToday(date)) {
			return formatTime(date);
		}

		// Se for de ontem, mostrar "Ontem às HH:MM"
		if (isYesterday(date)) {
			return `Ontem às ${formatTime(date)}`;
		}

		// Se for deste ano, mostrar "DD/MM às HH:MM"
		if (isCurrentYear(date)) {
			return `${date.getDate().toString().padStart(2, "0")}/${(
				date.getMonth() + 1
			)
				.toString()
				.padStart(2, "0")} às ${formatTime(date)}`;
		}

		// Caso contrário, mostrar data completa
		return `${date.getDate().toString().padStart(2, "0")}/${(
			date.getMonth() + 1
		)
			.toString()
			.padStart(2, "0")}/${date.getFullYear()} ${formatTime(date)}`;
	} catch (error) {
		console.error("Erro ao formatar data:", error);
		return "";
	}
};

/**
 * Verifica se uma data é de hoje
 * @param {Date} date - Data a verificar
 * @returns {boolean} - Verdadeiro se for hoje
 */
const isToday = (date) => {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};

/**
 * Verifica se uma data é de ontem
 * @param {Date} date - Data a verificar
 * @returns {boolean} - Verdadeiro se for ontem
 */
const isYesterday = (date) => {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	return (
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear()
	);
};

/**
 * Verifica se uma data é do ano atual
 * @param {Date} date - Data a verificar
 * @returns {boolean} - Verdadeiro se for do ano atual
 */
const isCurrentYear = (date) => {
	const today = new Date();
	return date.getFullYear() === today.getFullYear();
};

/**
 * Formata uma data em formato de hora (HH:MM)
 * @param {Date} date - Data a formatar
 * @returns {string} - Hora formatada
 */
const formatTime = (date) => {
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};
