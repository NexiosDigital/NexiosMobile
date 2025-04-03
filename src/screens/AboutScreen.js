import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutScreen = () => {
  const handleOpenLink = (url) => {
    Linking.openURL(url).catch(err => {
      console.error('Erro ao abrir URL:', err);
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/nexios-logo.png')} 
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
          O Nexios Digital Assistente é uma extensão mobile da nossa plataforma web,
          oferecendo acesso ao nosso assistente virtual de IA em qualquer lugar.
          
          Utilize nosso assistente para obter informações sobre nossos serviços,
          tirar dúvidas sobre automação, IA e transformação digital ou para
          simplesmente experimentar a potência da nossa tecnologia.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nossos Serviços</Text>
        
        <View style={styles.serviceItem}>
          <View style={[styles.serviceIcon, { backgroundColor: 'rgba(82, 130, 255, 0.1)' }]}>
            <Icon name="people" size={22} color="#5282FF" />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceName}>Agentes de IA para Atendimento</Text>
            <Text style={styles.serviceDescription}>
              Automatize o atendimento ao cliente com agentes de IA inteligentes.
            </Text>
          </View>
        </View>
        
        <View style={styles.serviceItem}>
          <View style={[styles.serviceIcon, { backgroundColor: 'rgba(255, 62, 108, 0.1)' }]}>
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
          <View style={[styles.serviceIcon, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
            <Icon name="settings" size={22} color="#FFC107" />
          </View>
          <View style={styles.serviceContent}>
            <Text style={styles.serviceName}>Automação de Processos</Text>
            <Text style={styles.serviceDescription}>
              Elimine tarefas repetitivas e reduza erros com automação inteligente.
            </Text>
          </View>
        </View>
        
        <View style={styles.serviceItem}>
          <View style={[styles.serviceIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
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
          onPress={() => handleOpenLink('https://nexiosdigital.com')}
        >
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(66, 133, 244, 0.1)' }]}>
            <Icon name="globe" size={22} color="#4285F4" />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactText}>nexiosdigital.com</Text>
          </View>
          <Icon name="open-outline" size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => handleOpenLink('mailto:administracao@nexiosdigital.com')}
        >
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(234, 67, 53, 0.1)' }]}>
            <Icon name="mail" size={22} color="#EA4335" />
          </View>
          <View style={styles.contactContent}>
            <Text style={styles.contactText}>administracao@nexiosdigital.com</Text>
          </View>
          <Icon name="open-outline" size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => handleOpenLink('https://wa.me/5522974033384')}
        >
          <View style={[styles.contactIcon, { backgroundColor: 'rgba(37, 211, 102, 0.1)' }]}>
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
          © {new Date().getFullYear()} Nexios Digital. Todos os direitos reservados.
        </Text>
      </View>
    </ScrollView>
  );