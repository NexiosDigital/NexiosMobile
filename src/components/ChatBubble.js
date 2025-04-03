import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Animated,
	Image,
	TouchableOpacity,
	Linking,
	Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { formatMessageTime } from "../utils/dateFormatter";

const ChatBubble = ({ message, isLastMessage }) => {
	const isUser = message.role === "user";
	const isTemporary = message.isTemporary;

	// Animação de fade-in
	const fadeAnim = React.useRef(new Animated.Value(0)).current;

	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [fadeAnim]);

	// Verificar se existe um anexo na mensagem
	const hasAttachment =
		message.content && message.content.includes("[Arquivo](");

	// Extrair URL do arquivo, se existir
	const extractFileData = () => {
		if (!hasAttachment) return { content: message.content, fileUrl: null };

		// Extrair URL usando expressão regular
		const regex = /\[Arquivo\]\((https?:\/\/[^\s)]+)\)/g;
		const match = regex.exec(message.content);

		if (match && match[1]) {
			// Remover a parte do anexo do conteúdo
			let cleanContent = message.content.replace(regex, "").trim();
			return { content: cleanContent, fileUrl: match[1] };
		}

		return { content: message.content, fileUrl: null };
	};

	// Determinar tipo de arquivo baseado na URL
	const getFileType = (url) => {
		if (!url) return "unknown";

		const lowerUrl = url.toLowerCase();
		if (lowerUrl.match(/\.(jpeg|jpg|png|gif|webp|bmp)(\?.*)?$/)) return "image";
		if (lowerUrl.match(/\.(pdf)(\?.*)?$/)) return "pdf";
		if (lowerUrl.match(/\.(doc|docx)(\?.*)?$/)) return "doc";
		if (lowerUrl.match(/\.(xls|xlsx)(\?.*)?$/)) return "spreadsheet";
		if (lowerUrl.match(/\.(ppt|pptx)(\?.*)?$/)) return "presentation";
		return "file";
	};

	// Obter ícone baseado no tipo de arquivo
	const getFileIcon = (fileType) => {
		switch (fileType) {
			case "image":
				return "image";
			case "pdf":
				return "document-text";
			case "doc":
				return "document";
			case "spreadsheet":
				return "grid";
			case "presentation":
				return "easel";
			default:
				return "document-attach";
		}
	};

	// Abrir o arquivo
	const handleOpenFile = (url) => {
		Linking.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					Linking.openURL(url);
				} else {
					Alert.alert("Erro", "Não foi possível abrir este arquivo.", [
						{ text: "OK" },
					]);
				}
			})
			.catch((err) => {
				console.error("Erro ao abrir URL:", err);
				Alert.alert("Erro", "Ocorreu um problema ao tentar abrir o arquivo.", [
					{ text: "OK" },
				]);
			});
	};

	// Extrair dados da mensagem
	const { content, fileUrl } = extractFileData();
	const fileType = getFileType(fileUrl);
	const fileIcon = getFileIcon(fileType);

	return (
		<Animated.View
			style={[
				styles.container,
				isUser ? styles.userContainer : styles.assistantContainer,
				{ opacity: fadeAnim },
			]}
		>
			{/* Avatar para mensagens do assistente */}
			{!isUser && (
				<View style={styles.avatar}>
					<Icon name="logo-electron" size={16} color="#fff" />
				</View>
			)}

			<View
				style={[
					styles.bubble,
					isUser ? styles.userBubble : styles.assistantBubble,
					isTemporary && styles.temporaryBubble,
				]}
			>
				{/* Conteúdo da mensagem */}
				{content && content.length > 0 && (
					<Text
						style={[
							styles.messageText,
							isUser ? styles.userText : styles.assistantText,
							isTemporary && styles.temporaryText,
						]}
					>
						{content}
					</Text>
				)}

				{/* Anexo de arquivo (se existir) */}
				{fileUrl && (
					<TouchableOpacity
						style={styles.attachment}
						onPress={() => handleOpenFile(fileUrl)}
						activeOpacity={0.7}
					>
						{fileType === "image" ? (
							<Image
								source={{ uri: fileUrl }}
								style={styles.attachmentImage}
								resizeMode="cover"
							/>
						) : (
							<View style={styles.fileContainer}>
								<Icon name={fileIcon} size={24} color="#fff" />
								<Text style={styles.fileName}>
									{fileUrl.substring(fileUrl.lastIndexOf("/") + 1)}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				)}

				{/* Timestamp */}
				<Text style={styles.timestamp}>
					{formatMessageTime(message.timestamp)}
				</Text>

				{/* Indicador de mensagem temporária */}
				{isTemporary && (
					<View style={styles.loadingDots}>
						<View style={[styles.dot, styles.dot1]} />
						<View style={[styles.dot, styles.dot2]} />
						<View style={[styles.dot, styles.dot3]} />
					</View>
				)}
			</View>

			{/* Avatar para mensagens do usuário */}
			{isUser && (
				<View style={[styles.avatar, styles.userAvatar]}>
					<Icon name="person" size={16} color="#fff" />
				</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginVertical: 8,
		alignItems: "flex-end",
	},
	userContainer: {
		justifyContent: "flex-end",
	},
	assistantContainer: {
		justifyContent: "flex-start",
	},
	avatar: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#ff3e6c",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	userAvatar: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		marginLeft: 8,
		marginRight: 0,
	},
	bubble: {
		borderRadius: 18,
		paddingHorizontal: 16,
		paddingVertical: 10,
		maxWidth: "75%",
	},
	userBubble: {
		backgroundColor: "#ff3e6c",
		borderBottomRightRadius: 4,
	},
	assistantBubble: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderBottomLeftRadius: 4,
	},
	temporaryBubble: {
		opacity: 0.7,
	},
	messageText: {
		fontSize: 16,
		marginBottom: 5,
		lineHeight: 22,
	},
	userText: {
		color: "#fff",
	},
	assistantText: {
		color: "#fff",
	},
	temporaryText: {
		fontStyle: "italic",
	},
	timestamp: {
		fontSize: 11,
		color: "rgba(255, 255, 255, 0.5)",
		alignSelf: "flex-end",
	},
	loadingDots: {
		flexDirection: "row",
		marginTop: 4,
		alignSelf: "flex-start",
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginRight: 3,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
	},
	dot1: {
		opacity: 0.4,
		transform: [{ scale: 0.8 }],
	},
	dot2: {
		opacity: 0.7,
		transform: [{ scale: 0.9 }],
	},
	dot3: {
		opacity: 1,
		transform: [{ scale: 1 }],
	},
	attachment: {
		marginTop: 8,
		marginBottom: 8,
		borderRadius: 12,
		overflow: "hidden",
	},
	attachmentImage: {
		width: "100%",
		height: 180,
		borderRadius: 12,
	},
	fileContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 12,
		padding: 12,
	},
	fileName: {
		color: "#fff",
		marginLeft: 8,
		flex: 1,
		fontSize: 14,
	},
});

export default ChatBubble;
