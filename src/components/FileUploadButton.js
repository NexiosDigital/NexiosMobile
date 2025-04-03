import React, { useState } from "react";
import {
	View,
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
	Platform,
	PermissionsAndroid,
	Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";

const FileUploadButton = ({ onFileSelected, disabled = false }) => {
	const [uploading, setUploading] = useState(false);

	// Solicitar permissões de câmera para Android
	const requestCameraPermission = async () => {
		if (Platform.OS !== "android") return true;

		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.CAMERA,
				{
					title: "Permissão de Câmera",
					message: "O app precisa acessar sua câmera para anexar fotos.",
					buttonNeutral: "Pergunte-me depois",
					buttonNegative: "Cancelar",
					buttonPositive: "OK",
				}
			);
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		} catch (err) {
			console.error("Erro ao solicitar permissão de câmera:", err);
			return false;
		}
	};

	// Abrir a câmera
	const handleCamera = async () => {
		if (disabled) return;

		const hasPermission = await requestCameraPermission();
		if (!hasPermission) {
			Alert.alert(
				"Permissão Negada",
				"Você precisa permitir o acesso à câmera para usar esta função."
			);
			return;
		}

		try {
			const result = await launchCamera({
				mediaType: "photo",
				quality: 0.8,
				maxWidth: 1280,
				maxHeight: 1280,
			});

			if (result.didCancel) return;

			if (result.errorCode) {
				console.error("Erro de câmera:", result.errorMessage);
				Alert.alert("Erro", "Não foi possível capturar a foto.");
				return;
			}

			if (result.assets && result.assets.length > 0) {
				const file = result.assets[0];
				handleFileUpload(file);
			}
		} catch (error) {
			console.error("Erro ao abrir câmera:", error);
			Alert.alert("Erro", "Não foi possível acessar a câmera.");
		}
	};

	// Abrir galeria de imagens
	const handleGallery = async () => {
		if (disabled) return;

		try {
			const result = await launchImageLibrary({
				mediaType: "photo",
				quality: 0.8,
				maxWidth: 1280,
				maxHeight: 1280,
			});

			if (result.didCancel) return;

			if (result.errorCode) {
				console.error("Erro de galeria:", result.errorMessage);
				Alert.alert("Erro", "Não foi possível selecionar a imagem.");
				return;
			}

			if (result.assets && result.assets.length > 0) {
				const file = result.assets[0];
				handleFileUpload(file);
			}
		} catch (error) {
			console.error("Erro ao abrir galeria:", error);
			Alert.alert("Erro", "Não foi possível acessar a galeria de imagens.");
		}
	};

	// Abrir seletor de documentos
	const handleDocument = async () => {
		if (disabled) return;

		try {
			const results = await DocumentPicker.pick({
				type: [
					DocumentPicker.types.allFiles,
					DocumentPicker.types.pdf,
					DocumentPicker.types.doc,
					DocumentPicker.types.docx,
					DocumentPicker.types.images,
				],
			});

			if (results && results.length > 0) {
				const file = results[0];
				handleFileUpload(file);
			}
		} catch (error) {
			if (DocumentPicker.isCancel(error)) {
				// Usuário cancelou
				return;
			}
			console.error("Erro ao selecionar documento:", error);
			Alert.alert("Erro", "Não foi possível selecionar o documento.");
		}
	};

	// Processar o arquivo selecionado
	const handleFileUpload = async (file) => {
		try {
			setUploading(true);

			// Verificar o tamanho do arquivo (limitado a 10MB)
			const fileSizeInMB = file.fileSize / (1024 * 1024);
			if (fileSizeInMB > 10) {
				Alert.alert(
					"Arquivo muito grande",
					"O tamanho máximo permitido é 10MB."
				);
				setUploading(false);
				return;
			}

			// Preparar o arquivo para upload
			const fileData = {
				uri: file.uri,
				type: file.type || "application/octet-stream",
				name: file.fileName || file.name || "arquivo",
				size: file.fileSize,
			};

			// Chamar callback com o arquivo
			if (onFileSelected) {
				await onFileSelected(fileData);
			}

			setUploading(false);
		} catch (error) {
			console.error("Erro ao processar arquivo:", error);
			Alert.alert("Erro", "Falha ao processar o arquivo selecionado.");
			setUploading(false);
		}
	};

	// Mostrar opções de upload
	const showUploadOptions = () => {
		if (disabled) return;

		Alert.alert(
			"Anexar arquivo",
			"Selecione uma opção",
			[
				{
					text: "Tirar foto",
					onPress: handleCamera,
				},
				{
					text: "Escolher da galeria",
					onPress: handleGallery,
				},
				{
					text: "Documento",
					onPress: handleDocument,
				},
				{
					text: "Cancelar",
					style: "cancel",
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.buttonDisabled]}
			onPress={showUploadOptions}
			disabled={disabled || uploading}
		>
			{uploading ? (
				<ActivityIndicator size="small" color="#fff" />
			) : (
				<Icon name="attach" size={20} color={disabled ? "#666" : "#fff"} />
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "rgba(255, 62, 108, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 8,
	},
	buttonDisabled: {
		opacity: 0.5,
	},
});

export default FileUploadButton;
