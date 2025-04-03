# Nexios Digital Mobile App

Aplicativo móvel para o assistente de IA da Nexios Digital, permitindo interações com o assistente virtual de qualquer lugar.

## Visão Geral

Este aplicativo é uma extensão móvel da plataforma web da Nexios Digital, focado em fornecer acesso ao assistente virtual de IA. Ele se conecta ao mesmo backend utilizado pelo chat web, garantindo uma experiência consistente em todas as plataformas.

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicações mobile
- **Axios**: Cliente HTTP para comunicação com API
- **React Navigation**: Navegação entre telas do aplicativo
- **Async Storage**: Armazenamento local de dados
- **React Native Vector Icons**: Ícones para a interface
- **WebSockets**: Comunicação em tempo real com o servidor

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- React Native CLI
- Xcode (para desenvolvimento iOS)
- CocoaPods (para iOS)
- JDK e Android Studio (para desenvolvimento Android)

## Configuração do Ambiente de Desenvolvimento

1. Clone o repositório:
   ```bash
   git clone https://github.com/sua-organizacao/nexios-mobile.git
   cd nexios-mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou com yarn
   yarn install
   ```

3. Configure o endpoint da API:
   
   Edite o arquivo `src/constants/endpoints.js` e atualize o `API_URL` para o endereço do seu servidor. Para desenvolvimento local, você pode usar o IP do seu computador na rede local.

4. Instale os pods (apenas para iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

## Executando o Aplicativo

### iOS
```bash
npm run ios
# ou com yarn
yarn ios
```

Isso iniciará o aplicativo no simulador iOS padrão. Para executar em um dispositivo específico, você pode usar:
```bash
npx react-native run-ios --device "Nome do Dispositivo"
```

### Android
```bash
npm run android
# ou com yarn
yarn android
```

## Estrutura do Projeto

```
nexios-mobile/
├── ios/                       # Pasta específica para iOS
├── android/                   # Pasta específica para Android
├── src/
│   ├── assets/                # Imagens, fontes e recursos estáticos
│   ├── components/            # Componentes React reutilizáveis
│   ├── screens/               # Telas da aplicação
│   ├── services/              # Serviços e integrações com APIs
│   ├── contexts/              # Contextos para gerenciamento de estado
│   ├── utils/                 # Funções utilitárias
│   ├── constants/             # Constantes do aplicativo
│   └── App.js                 # Componente principal
└── ...
```

## Integração com o Backend

O aplicativo se conecta ao backend da Nexios Digital através dos seguintes endpoints:

- `/api/chat-n8n`: Para envio de mensagens
- `/api/status`: Para verificar o status do servidor
- `/api/messages/{conversation_id}`: Para recuperar histórico de mensagens
- `/ws/{client_id}`: Para comunicação WebSocket em tempo real

A comunicação com o backend é gerenciada pelos serviços em `src/services/`.

## Customização

### Alterando Cores e Tema

As cores principais do aplicativo são definidas nos estilos de cada componente. Para uma customização global, considere criar um arquivo de tema em `src/constants/theme.js` e importá-lo nos componentes.

### Alterando o Logo e as Imagens

Substitua os arquivos em `src/assets/images/` mantendo os mesmos nomes para facilitar a atualização.

## Gerando o App para Produção

### iOS
1. Abra o projeto no Xcode:
   ```bash
   open ios/NexiosMobile.xcworkspace
   ```
2. Selecione "Generic iOS Device" ou um dispositivo específico
3. Vá para Product > Archive
4. Siga as instruções para distribuição na App Store ou ad-hoc

### Android
1. Gere um keystore para assinatura (se ainda não tiver um):
   ```bash
   keytool -genkey -v -keystore nexios-release-key.keystore -alias nexios-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Edite o arquivo `android/gradle.properties` com as informações do keystore
3. Gere o APK ou AAB:
   ```bash
   cd android
   ./gradlew assembleRelease  # para APK
   # ou
   ./gradlew bundleRelease    # para AAB (Google Play)
   ```

## Solução de Problemas Comuns

### Problemas de Conexão WebSocket
- Verifique se o endpoint