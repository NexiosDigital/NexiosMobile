import React, {useContext, useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ChatContext} from '../contexts/ChatContext';
import ChatBubble from '../components/ChatBubble';
import MessageInput from '../components/MessageInput';
import ConnectionStatus from '../components/ConnectionStatus';
import {uploadFile} from '../services/fileUploadService';

const ChatScreen = () => {
  const {
    messages,
    sendMessage: contextSendMessage,
    isTyping,
    connectionStatus,
    reconnect,
    conversationId,
  } = useContext(ChatContext);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const flatListRef = useRef(null);
  const navigation = useNavigation();

  // Configurar botões de navegação no header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {connectionStatus !== 'connected' && (
            <TouchableOpacity style={styles.headerButton} onPress={reconnect}>
              <Icon name="refresh" size={22} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View style={styles.headerLogo}>
          <Image
            source={require('../assets/nexios-icon.png')}
            style={styles.logoImage}
          />
        </View>
      ),
    });
  }, [navigation, connectionStatus, reconnect]);

  // Rolar para a última mensagem quando novas mensagens chegarem
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  // Gerenciar upload de arquivos
  const handleFileUpload = async fileData => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simular progresso (em um app real, você usaria onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
          }
          return newProgress < 90 ? newProgress : 90;
        });
      }, 300);

      // Fazer upload do arquivo
      const result = await uploadFile(fileData, conversationId);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Retornar URL do arquivo para ser incluído na mensagem
      return result.fileUrl;
    } catch (error) {
      console.error('Erro ao fazer upload de arquivo:', error);
      Alert.alert(
        'Erro de Upload',
        'Não foi possível enviar o arquivo. Tente novamente mais tarde.',
      );
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Enviar mensagem com potencial anexo
  const handleSendMessage = async (text, file) => {
    try {
      let fileUrl = null;

      // Se houver arquivo, fazer upload primeiro
      if (file) {
        fileUrl = await handleFileUpload(file);
      }

      // Incluir URL do arquivo na mensagem se existir
      let fullMessage = text;
      if (fileUrl) {
        if (fullMessage.trim().length > 0) {
          fullMessage += `\n\n[Arquivo](${fileUrl})`;
        } else {
          fullMessage = `[Arquivo](${fileUrl})`;
        }
      }

      // Enviar a mensagem completa
      contextSendMessage(fullMessage);
    } catch (error) {
      console.error('Erro ao enviar mensagem com arquivo:', error);
      Alert.alert(
        'Erro',
        'Não foi possível enviar sua mensagem. Tente novamente.',
      );
    }
  };

  // Renderizar cada mensagem
  const renderMessage = ({item, index}) => (
    <ChatBubble message={item} isLastMessage={index === messages.length - 1} />
  );

  // Renderizar indicador de digitação
  const renderTypingIndicator = () => {
    if (!isTyping && !isUploading) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>
            {isUploading
              ? `Enviando arquivo (${uploadProgress}%)...`
              : 'Assistente está digitando'}
          </Text>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, styles.typingDot1]} />
            <View style={[styles.typingDot, styles.typingDot2]} />
            <View style={[styles.typingDot, styles.typingDot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Status da conexão */}
      <ConnectionStatus status={connectionStatus} />

      {/* Lista de mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) =>
          `msg-${index}-${item.timestamp || Date.now()}`
        }
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma mensagem ainda. Comece uma conversa!
            </Text>
          </View>
        )}
      />

      {/* Input para enviar mensagens */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onFileUpload={() => {}}
        disabled={isTyping || isUploading || connectionStatus === 'error'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070709',
  },
  headerButtons: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  headerLogo: {
    paddingLeft: 15,
  },
  logoImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 100,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: '#bbb',
    fontSize: 14,
    marginRight: 10,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3e6c',
    marginHorizontal: 2,
  },
  typingDot1: {
    opacity: 0.5,
    transform: [{scale: 0.8}],
  },
  typingDot2: {
    opacity: 0.7,
    transform: [{scale: 0.9}],
  },
  typingDot3: {
    opacity: 0.9,
    transform: [{scale: 1}],
  },
});

export default ChatScreen;
