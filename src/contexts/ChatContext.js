import React, { createContext, useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendMessage, checkConnectionStatus } from '../services/chatService';
import { API_URL } from '../constants/endpoints';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Estado para as mensagens
  const [messages, setMessages] = useState([]);
  
  // Estado para a conexão WebSocket
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [clientId, setClientId] = useState(null);

  // Referências
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const socketRetryCountRef = useRef(0);
  const pollingIntervalRef = useRef(null);

  // Carrega mensagens e IDs do AsyncStorage ao iniciar
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // Carregar mensagens
        const storedMessages = await AsyncStorage.getItem('chat_messages');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        } else {
          // Adicionar mensagem de boas-vindas se não houver mensagens armazenadas
          const welcomeMessage = {
            role: 'assistant',
            content: 'Olá! Sou o assistente virtual da Nexios Digital. Como posso ajudar você hoje?',
            timestamp: new Date().toISOString()
          };
          setMessages([welcomeMessage]);
          await AsyncStorage.setItem('chat_messages', JSON.stringify([welcomeMessage]));
        }

        // Carregar IDs de conversa
        const storedConversationId = await AsyncStorage.getItem('conversation_id');
        if (storedConversationId) {
          setConversationId(storedConversationId);
        }

        // Gerar ou carregar clientId
        let storedClientId = await AsyncStorage.getItem('client_id');
        if (!storedClientId) {
          storedClientId = `mobile-${Platform.OS}-${Date.now()}`;
          await AsyncStorage.setItem('client_id', storedClientId);
        }
        setClientId(storedClientId);
      } catch (error) {
        console.error('Erro ao carregar dados armazenados:', error);
      }
    };

    loadStoredData();
  }, []);

  // Atualizar AsyncStorage quando as mensagens mudarem
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem('chat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Atualizar AsyncStorage quando o conversationId mudar
  useEffect(() => {
    if (conversationId) {
      AsyncStorage.setItem('conversation_id', conversationId);
    }
  }, [conversationId]);

  // Verificar status da conexão quando o app inicia
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await checkConnectionStatus();
        if (status.server === 'online') {
          setConnectionStatus('connected');
          setupWebSocket();
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        console.error('Erro ao verificar status da conexão:', error);
        setConnectionStatus('error');
      }
    };

    checkConnection();

    return () => {
      // Limpar conexões ao desmontar
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Configurar WebSocket
  const setupWebSocket = () => {
    // Limpar timeout de reconexão anterior, se existir
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Converter a URL HTTP para WebSocket (ws:// ou wss://)
    const wsProtocol = API_URL.startsWith('https') ? 'wss' : 'ws';
    const wsBaseUrl = API_URL.replace(/^https?:\\/\\//, `${wsProtocol}://`);

    // Incluir ID da conversa como query param se disponível
    let wsUrl = `${wsBaseUrl}/ws/${clientId}`;
    if (conversationId) {
      wsUrl += `?conversation_id=${conversationId}`;
    }

    console.log(`Conectando ao WebSocket: ${wsUrl}`);
    setConnectionStatus('connecting');

    try {
      // Criar nova conexão WebSocket
      const newSocket = new WebSocket(wsUrl);
      socketRef.current = newSocket;

      newSocket.onopen = () => {
        console.log('WebSocket conectado!');
        setConnectionStatus('connected');
        socketRetryCountRef.current = 0; // Resetar contador de tentativas

        // Se tivermos um ID de conversa, enviar para associação
        if (conversationId) {
          try {
            const associationMessage = JSON.stringify({
              conversation_id: conversationId,
              client_id: clientId,
            });
            console.log(`Enviando associação: ${associationMessage}`);
            newSocket.send(associationMessage);
          } catch (err) {
            console.error('Erro ao enviar mensagem de associação:', err);
          }
        }
      };

      newSocket.onmessage = (event) => {
        console.log('Mensagem recebida via WebSocket:', event.data);
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'message') {
            // Nova mensagem recebida do assistente via WebSocket
            console.log('Mensagem do assistente via WebSocket:', data.content);

            // Verificar se já temos essa mensagem
            const messageExists = messages.some(
              (msg) => msg.role === 'assistant' && msg.content === data.content
            );

            if (!messageExists) {
              // Adicionar nova mensagem
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: data.content,
                  timestamp: data.timestamp || new Date().toISOString(),
                },
              ]);
              setIsTyping(false);
            }
          } else if (data.type === 'connection_status') {
            console.log('Status da conexão WebSocket:', data.status);
            setConnectionStatus(data.status);
          } else if (data.type === 'association_success') {
            console.log('Associação de ID bem-sucedida:', data.message);
            // Verificar se há um novo ID de conversa no response
            if (data.conversation_id && !conversationId) {
              setConversationId(data.conversation_id);
            }
          } else if (data.type === 'message_history') {
            console.log('Recebido histórico de mensagens:', data.messages);

            // Processar apenas se tiver mensagens
            if (data.messages && data.messages.length > 0) {
              // Procurar a última mensagem do assistente
              const assistantMessages = data.messages.filter(
                (msg) => msg.role === 'assistant'
              );

              if (assistantMessages.length > 0) {
                const latestAssistantMsg =
                  assistantMessages[assistantMessages.length - 1];

                // Verificar se já temos essa mensagem
                const messageExists = messages.some(
                  (msg) =>
                    msg.role === 'assistant' &&
                    msg.content === latestAssistantMsg.content
                );

                if (!messageExists) {
                  console.log(
                    'Nova mensagem do histórico a ser exibida:',
                    latestAssistantMsg.content
                  );

                  // Adicionar nova mensagem
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'assistant',
                      content: latestAssistantMsg.content,
                      timestamp: latestAssistantMsg.timestamp || new Date().toISOString(),
                    },
                  ]);
                  setIsTyping(false);
                }
              }
            }
          }
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };

      newSocket.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        setConnectionStatus((prev) => (prev === 'error' ? 'error' : 'offline'));

        // Tentar reconectar após alguns segundos se não foi fechado intencionalmente
        if (event.code !== 1000) {
          socketRetryCountRef.current += 1;
          const delay = Math.min(
            30000,
            1000 * Math.pow(2, socketRetryCountRef.current)
          ); // Exponential backoff até 30s
          console.log(`Tentando reconectar em ${delay / 1000} segundos...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Tentando reconexão WebSocket...');
            setupWebSocket();
          }, delay);
        }
      };

      newSocket.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setConnectionStatus('error');
      };
    } catch (error) {
      console.error('Erro ao configurar WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  // Enviar mensagem
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    // Atualizar UI com a mensagem do usuário
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Preparar o histórico de mensagens - últimas 10 mensagens para não sobrecarregar
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp || new Date().toISOString(),
        }));

      // Enviar a mensagem para o backend
      const response = await sendMessage(messageText, conversationHistory, conversationId);
      console.log('Resposta recebida:', response);

      // Salvar o ID da conversa se fornecido
      if (response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      // Verificar se a resposta indica processamento assíncrono
      if (response.status === 'processing') {
        console.log('Mensagem em processamento...');

        // Mostrar mensagem temporária de "processando"
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response.response || 'Processando sua mensagem...',
            isTemporary: true,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        // Se não for processamento assíncrono, mostrar resposta direta
        const timestamp = new Date().toISOString();

        setMessages((prev) => {
          // Filtrar mensagens temporárias
          const filteredMessages = prev.filter(msg => !msg.isTemporary);
          
          return [
            ...filteredMessages,
            {
              role: 'assistant',
              content: response.response,
              timestamp: timestamp,
            },
          ];
        });
        
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);

      // Mostrar mensagem de erro
      const errorMessage = {
        role: 'assistant',
        content:
          'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente mais tarde ou verifique sua conexão com a internet.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        // Remover mensagens temporárias
        const filteredMessages = prev.filter(msg => !msg.isTemporary);
        return [...filteredMessages, errorMessage];
      });
      
      setIsTyping(false);
    }
  };

  // Limpar histórico de chat
  const clearChat = async () => {
    try {
      // Manter apenas a mensagem de boas-vindas
      const welcomeMessage = {
        role: 'assistant',
        content: 'Olá! Sou o assistente virtual da Nexios Digital. Como posso ajudar você hoje?',
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
      await AsyncStorage.setItem('chat_messages', JSON.stringify([welcomeMessage]));
      
      // Limpar ID da conversa
      setConversationId(null);
      await AsyncStorage.removeItem('conversation_id');
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar o chat:', error);
      return false;
    }
  };

  const value = {
    messages,
    connectionStatus,
    isTyping,
    conversationId,
    sendMessage: handleSendMessage,
    clearChat,
    reconnect: setupWebSocket,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};