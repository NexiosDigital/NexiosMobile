import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const AboutScreen = ({navigation}) => {
  const handleOpenLink = url => {
    Linking.openURL(url).catch(err => {
      console.error('Erro ao abrir URL:', err);
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Sobre" showBackButton={true} showLogo={false} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../assets/nexios-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Nexios Digital</Text>
          <Text style={styles.subtitle}>Assistente Mobile</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          <Text style={styles.sectionContent}>
            O Nexios Digital Assistente é uma extensão mobile da nossa
            plataforma web, oferecendo acesso ao nosso assistente virtual de IA
            em qualquer lugar. Utilize nosso assistente para obter informações
            sobre nossos serviços, tirar dúvidas sobre automação, IA e
            transformação digital ou para simplesmente experimentar a potência
            da nossa tecnologia.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Serviços</Text>

          <View style={styles.serviceItem}>
            <View
              style={[
                styles.serviceIcon,
                {backgroundColor: 'rgba(82, 130, 255, 0.1)'},
              ]}>
              <Icon name="people" size={22} color="#5282FF" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>
                Agentes de IA para Atendimento
              </Text>
              <Text style={styles.serviceDescription}>
                Automatize o atendimento ao cliente com agentes de IA
                inteligentes.
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View
              style={[
                styles.serviceIcon,
                {backgroundColor: 'rgba(255, 62, 108, 0.1)'},
              ]}>
              <Icon name="trending-up" size={22} color="#ff3e6c" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>Automação de Vendas</Text>
              <Text style={styles.serviceDescription}>
                Potencialize sua equipe de vendas com ferramentas de IA.
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View
              style={[
                styles.serviceIcon,
                {backgroundColor: 'rgba(255, 193, 7, 0.1)'},
              ]}>
              <Icon name="settings" size={22} color="#FFC107" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>Automação de Processos</Text>
              <Text style={styles.serviceDescription}>
                Elimine tarefas repetitivas e reduza erros com automação
                inteligente.
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View
              style={[
                styles.serviceIcon,
                {backgroundColor: 'rgba(76, 175, 80, 0.1)'},
              ]}>
              <Icon name="list" size={22} color="#4CAF50" />
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>Automação com ClickUp</Text>
              <Text style={styles.serviceDescription}>
                Otimize seus fluxos de trabalho e aumente a produtividade.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entre em Contato</Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink('https://nexiosdigital.com')}>
            <View
              style={[
                styles.contactIcon,
                {backgroundColor: 'rgba(66, 133, 244, 0.1)'},
              ]}>
              <Icon name="globe" size={22} color="#4285F4" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactText}>nexiosdigital.com</Text>
            </View>
            <Icon name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() =>
              handleOpenLink('mailto:administracao@nexiosdigital.com')
            }>
            <View
              style={[
                styles.contactIcon,
                {backgroundColor: 'rgba(234, 67, 53, 0.1)'},
              ]}>
              <Icon name="mail" size={22} color="#EA4335" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactText}>
                administracao@nexiosdigital.com
              </Text>
            </View>
            <Icon name="open-outline" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleOpenLink('https://wa.me/5522974033384')}>
            <View
              style={[
                styles.contactIcon,
                {backgroundColor: 'rgba(37, 211, 102, 0.1)'},
              ]}>
              <Icon name="logo-whatsapp" size={22} color="#25D366" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactText}>(22) 97403-3384</Text>
            </View>
            <Icon name="open-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Nexios Digital. Todos os direitos
            reservados.
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
  scrollView: {
    flex: 1,
    backgroundColor: '#070709',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#ff3e6c',
    fontSize: 18,
    marginBottom: 8,
  },
  version: {
    color: '#999',
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#ff3e6c',
    paddingLeft: 10,
  },
  sectionContent: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 22,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactText: {
    color: '#fff',
    fontSize: 15,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AboutScreen;
