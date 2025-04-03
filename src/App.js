import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ChatProvider } from "./contexts/ChatContext";

// Screens
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AboutScreen from "./screens/AboutScreen";
import HelpScreen from "./screens/HelpScreen";

// Components
import Header from "./components/Header";

// Ignorar avisos específicos do React Native (remover para produção)
LogBox.ignoreLogs(["Remote debugger"]);

const Stack = createStackNavigator();

const App = () => {
	return (
		<ChatProvider>
			<NavigationContainer>
				<SafeAreaView style={styles.container}>
					<StatusBar barStyle="light-content" backgroundColor="#0f0f13" />
					<Stack.Navigator
						initialRouteName="Chat"
						screenOptions={{
							headerShown: false, // Esconder cabeçalho padrão, usaremos nosso componente personalizado
							cardStyle: { backgroundColor: "#070709" },
						}}
					>
						<Stack.Screen name="Chat" component={ChatScreen} />
						<Stack.Screen name="Settings" component={SettingsScreen} />
						<Stack.Screen name="About" component={AboutScreen} />
						<Stack.Screen name="Help" component={HelpScreen} />
					</Stack.Navigator>
				</SafeAreaView>
			</NavigationContainer>
		</ChatProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#070709",
	},
});

export default App;
