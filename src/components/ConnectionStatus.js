import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ConnectionStatus = ({ status }) => {
	const translateY = useRef(new Animated.Value(-50)).current;
	const opacity = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Se não for 'connected', mostrar o status
		if (status !== "connected") {
			// Animar entrada
			Animated.parallel([
				Animated.timing(translateY, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			// Animar saída
			Animated.parallel([
				Animated.timing(translateY, {
					toValue: -50,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [status, translateY, opacity]);

	// Se o status for connected, não mostrar nada
	if (status === "connected") return null;

	// Definir ícone e cor baseado no status
	let icon, backgroundColor, statusText;

	switch (status) {
		case "connecting":
			icon = "sync";
			backgroundColor = "#FFC107";
			statusText = "Conectando...";
			break;
		case "error":
			icon = "alert-circle";
			backgroundColor = "#F44336";
			statusText = "Erro de conexão";
			break;
		case "offline":
			icon = "cloud-offline";
			backgroundColor = "#607D8B";
			statusText = "Offline";
			break;
		default:
			icon = "information-circle";
			backgroundColor = "#2196F3";
			statusText = "Status desconhecido";
	}

	return (
		<Animated.View
			style={[
				styles.container,
				{ backgroundColor },
				{ transform: [{ translateY }], opacity },
			]}
		>
			<Icon name={icon} size={18} color="#fff" style={styles.icon} />
			<Text style={styles.text}>{statusText}</Text>

			{/* Animação de "connecting" */}
			{status === "connecting" && (
				<View style={styles.loadingDots}>
					<View style={[styles.dot, styles.dot1]} />
					<View style={[styles.dot, styles.dot2]} />
					<View style={[styles.dot, styles.dot3]} />
				</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		width: "100%",
		position: "absolute",
		top: 0,
		zIndex: 100,
	},
	icon: {
		marginRight: 8,
	},
	text: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 14,
	},
	loadingDots: {
		flexDirection: "row",
		marginLeft: 8,
		alignItems: "center",
	},
	dot: {
		width: 5,
		height: 5,
		borderRadius: 2.5,
		marginHorizontal: 2,
		backgroundColor: "#fff",
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
});

export default ConnectionStatus;
