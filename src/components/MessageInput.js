import React, { useState, useRef } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Keyboard,
	Animated,
	Dimensions,
	Text,
	Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FileUploadButton from "./FileUploadButton";

const MessageInput = ({ onSendMessage, onFileUpload, disabled = false }) => {
	const [message, setMessage] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [attachedFile, setAttachedFile] = useState(null);

	// Referência para animação
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const inputRef = useRef(null);

	// Função para enviar mensagem
	const handleSend = () => {
		if ((message.trim().length > 0 || attachedFile) && !disabled) {
			onSendMessage(message.trim(), attachedFile);
			setMessage("");
			setAttachedFile(null);
			Keyboard.dismiss();

			// Animar botão
			Animated.sequence([
				Animated.timing(scaleAnim, {
					toValue: 0.8,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(scaleAnim, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}),
			]).start();
		}
	};

	// Efeito de foco
	const handleFocus = () => setIsFocused(true);
	const handleBlur = () => setIsFocused(false);

	// Lidar com o arquivo selecionado
	const handleFileSelected = async (fileData) => {
		setAttachedFile(fileData);
		if (onFileUpload) {
			await onFileUpload(fileData);
		}
	};

	// Remover arquivo anexado
	const handleRemoveFile = () => {
		setAttachedFile(null);
	};

	return (
		<View style={styles.container}>
			{/* Preview de arquivo anexado */}
			{attachedFile && (
				<View style={styles.attachmentPreview}>
					{attachedFile.type.startsWith("image/") ? (
						<Image
							source={{ uri: attachedFile.uri }}
							style={styles.attachmentImage}
							resizeMode="cover"
						/>
					) : (
						<View style={styles.attachmentFile}>
							<Icon name="document" size={24} color="#ff3e6c" />
						</View>
					)}
					<Text style={styles.attachmentName} numberOfLines={1}>
						{attachedFile.name}
					</Text>
					<TouchableOpacity
						style={styles.removeButton}
						onPress={handleRemoveFile}
					>
						<Icon name="close-circle" size={22} color="#ff3e6c" />
					</TouchableOpacity>
				</View>
			)}

			<View
				style={[
					styles.inputContainer,
					isFocused && styles.inputContainerFocused,
					disabled && styles.inputContainerDisabled,
				]}
			>
				{/* Botão de anexo */}
				<FileUploadButton
					onFileSelected={handleFileSelected}
					disabled={disabled}
				/>

				<TextInput
					ref={inputRef}
					style={styles.input}
					placeholder="Digite sua mensagem..."
					placeholderTextColor="#666"
					value={message}
					onChangeText={setMessage}
					onFocus={handleFocus}
					onBlur={handleBlur}
					multiline
					maxLength={2000}
					editable={!disabled}
				/>

				<Animated.View
					style={[
						styles.sendButtonContainer,
						{ transform: [{ scale: scaleAnim }] },
					]}
				>
					<TouchableOpacity
						style={[
							styles.sendButton,
							message.trim().length === 0 &&
								!attachedFile &&
								styles.sendButtonDisabled,
							disabled && styles.sendButtonDisabled,
						]}
						onPress={handleSend}
						disabled={
							(message.trim().length === 0 && !attachedFile) || disabled
						}
						activeOpacity={0.7}
					>
						<Icon
							name="send"
							size={20}
							color={
								(message.trim().length === 0 && !attachedFile) || disabled
									? "#666"
									: "#fff"
							}
						/>
					</TouchableOpacity>
				</Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
		backgroundColor: "#0f0f13",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 24,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.1)",
		paddingHorizontal: 15,
	},
	inputContainerFocused: {
		borderColor: "#ff3e6c",
		shadowColor: "#ff3e6c",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
	},
	inputContainerDisabled: {
		opacity: 0.5,
	},
	input: {
		flex: 1,
		color: "#fff",
		fontSize: 16,
		paddingVertical: 12,
		maxHeight: 100, // Limitar altura
	},
	sendButtonContainer: {
		marginLeft: 10,
	},
	sendButton: {
		backgroundColor: "#ff3e6c",
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: "center",
		alignItems: "center",
	},
	sendButtonDisabled: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},
	attachmentPreview: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.05)",
		borderRadius: 12,
		marginBottom: 8,
		padding: 8,
	},
	attachmentImage: {
		width: 40,
		height: 40,
		borderRadius: 8,
		marginRight: 8,
	},
	attachmentFile: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: "rgba(255, 62, 108, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	attachmentName: {
		flex: 1,
		color: "#fff",
		fontSize: 14,
	},
	removeButton: {
		padding: 5,
	},
});

export default MessageInput;
