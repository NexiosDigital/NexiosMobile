import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Header from '../components/Header';

const HelpScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Ajuda" showBackButton={true} showLogo={false} />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Perguntas Frequentes</Text>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>Como iniciar uma conversa?</Text>
          <Text style={styles.answer}>
            Para iniciar uma conversa, basta digitar sua mensagem na caixa de
            texto na parte inferior da tela e pressionar o botão de envio.
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>Como enviar arquivos?</Text>
          <Text style={styles.answer}>
            Clique no ícone de clipe ao lado da caixa de mensagem e escolha uma
            opção: tirar foto, escolher da galeria ou enviar documento.
          </Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.question}>
            Como limpar o histórico de conversa?
          </Text>
          <Text style={styles.answer}>
            Vá para a tela de configurações através do ícone no canto superior
            direito e selecione a opção "Limpar conversa".
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070709',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  questionContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  question: {
    color: '#ff3e6c',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    color: '#ddd',
    fontSize: 16,
    lineHeight: 22,
  },
});

export default HelpScreen;
