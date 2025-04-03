import React, { useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Switch,
	Alert,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { ChatContext } from "../contexts/ChatContext";
import { API_URL } from "../constants/endpoints";

const SettingsScreen = () => {
	const { clearChat, conversationId, connectionStatus } =
		useContext(ChatContext);

	// Estados para configurações
	const [darkMode, setDarkMode] = useState(true); // Sempre true nesta versão
	const [saveChat, setSaveChat] = useState(true);
	const [pushNotifications, setPushNotifications] = useState(true);
	const [isClearing, setIsClearing] = useState(false);

	// Carregar configurações do AsyncStorage
	React.useEffect(() => {
		const loadSettings = async () => {
			try {
				const savedSettings = await AsyncStorage.getItem("app_settings");
				if (savedSettings) {
					const settings = JSON.parse(savedSettings);
					setSaveChat(settings.saveChat ?? true);
					setPushNotifications(settings.pushNotifications ?? true);
				}
			} catch (error) {
				console.error("Erro ao carregar configurações:", error);
			}
		};

		loadSettings();
	}, []);

	// Salvar configurações no AsyncStorage
	const saveSettings = async (key, value) => {
		try {
			const savedSettings = await AsyncStorage.getItem("app_settings");
			let settings = savedSettings ? JSON.parse(savedSettings) : {};

			settings[key] = value;
			await AsyncStorage.setItem("app_settings", JSON.stringify(settings));
		} catch (error) {
			console.error("Erro ao salvar configurações:", error);
		}
	};

	// Manipuladores de toggle
	const handleSaveChatToggle = (value) => {
		setSaveChat(value);
		saveSettings("saveChat", value);
	};

	const handlePushNotificationsToggle = (value) => {
		setPushNotifications(value);
		saveSettings("pushNotifications", value);
	};

	// Manipulador para limpar chat
	const handleClearChat = () => {
		Alert.alert(
			"Limpar conversa",
			"Tem certeza que deseja limpar todo o histórico de conversa? Esta ação não pode ser desfeita.",
			[
				{
					text: "Cancelar",
					style: "cancel",
				},
				{
					text: "Limpar",
					style: "destructive",
					onPress: async () => {
						setIsClearing(true);
						const success = await clearChat();
						setIsClearing(false);

						if (success) {
							Alert.alert(
								"Sucesso",
								"Histórico de conversa limpo com sucesso."
							);
						} else {
							Alert.alert("Erro", "Ocorreu um erro ao limpar o histórico.");
						}
					},
				},
			]
		);
	};

	// Renderizar seção de configurações
	const renderSection = (title, children) => (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<View style={styles.sectionContent}>{children}</View>
		</View>
	);

	// Renderizar item de configuração
	const renderSettingItem = (icon, title, description, rightElement) => (
		<View style={styles.settingItem}>
			<View style={styles.settingIcon}>
				<Icon name={icon} size={22} color="#ff3e6c" />
			</View>
			<View style={styles.settingInfo}>
				<Text style={styles.settingTitle}>{title}</Text>
				{description && (
					<Text style={styles.settingDescription}>{description}</Text>
				)}
			</View>
			<View style={styles.settingAction}>{rightElement}</View>
		</View>
	);

	return (
		<ScrollView style={styles.container}>
			{/* Seção de Chat */}
			{renderSection("Chat", [
				renderSettingItem(
					"save",
					"Salvar histórico",
					"Mantenha o histórico de conversa entre sessões",
					<Switch
						trackColor={{ false: "#333", true: "rgba(255, 62, 108, 0.3)" }}
						thumbColor={saveChat ? "#ff3e6c" : "#f4f3f4"}
						ios_backgroundColor="#333"
						onValueChange={handleSaveChatToggle}
						value={saveChat}
					/>
				),
				renderSettingItem(
					"trash-bin",
					"Limpar conversa",
					"Apagar todo o histórico de conversa",
					isClearing ? (
						<ActivityIndicator color="#ff3e6c" />
					) : (
						<TouchableOpacity
							style={styles.actionButton}
							onPress={handleClearChat}
						>
							<Text style={styles.actionButtonText}>Limpar</Text>
						</TouchableOpacity>
					)
				),
			])}

			{/* Seção de Notificações */}
			{renderSection("Notificações", [
				renderSettingItem(
					"notifications",
					"Notificações push",
					"Receber notificações de novas mensagens",
					<Switch
						trackColor={{ false: "#333", true: "rgba(255, 62, 108, 0.3)" }}
						thumbColor={pushNotifications ? "#ff3e6c" : "#f4f3f4"}
						ios_backgroundColor="#333"
						onValueChange={handlePushNotificationsToggle}
						value={pushNotifications}
					/>
				),
			])}

			{/* Seção de Informações */}
			{renderSection("Informações", [
				renderSettingItem(
					"information-circle",
					"Servidor",
					API_URL,
					<View
						style={[
							styles.statusIndicator,
							{
								backgroundColor:
									connectionStatus === "connected"
										? "#4CAF50"
										: connectionStatus === "connecting"
										? "#FFC107"
										: "#F44336",
							},
						]}
					/>
				),
				renderSettingItem(
					"key",
					"ID da Conversa",
					conversationId
						? `${conversationId.substring(0, 15)}...`
						: "Não iniciada",
					null
				),
			])}

			{/* Seção Sobre */}
			{renderSection("Sobre", [
				renderSettingItem("information-circle", "Versão", "1.0.0", null),
				renderSettingItem(
					"globe",
					"Website",
					"www.nexiosdigital.com",
					<TouchableOpacity>
						<Icon name="open-outline" size={20} color="#ff3e6c" />
					</TouchableOpacity>
				),
			])}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#070709",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		color: "#666",
		fontSize: 14,
		fontWeight: "600",
		marginHorizontal: 16,
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	sectionContent: {
		backgroundColor: "#0f0f13",
		borderRadius: 12,
		overflow: "hidden",
		marginHorizontal: 16,
	},
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.05)",
	},
	settingIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255, 62, 108, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	settingInfo: {
		flex: 1,
	},
	settingTitle: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
	},
	settingDescription: {
		color: "#999",
		fontSize: 13,
		marginTop: 4,
	},
	settingAction: {
		marginLeft: 16,
	},
	actionButton: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		backgroundColor: "rgba(255, 62, 108, 0.1)",
	},
	actionButtonText: {
		color: "#ff3e6c",
		fontSize: 14,
		fontWeight: "500",
	},
	statusIndicator: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},
});

export default SettingsScreen;
