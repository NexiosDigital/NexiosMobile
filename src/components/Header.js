import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({
  title,
  showBackButton = false,
  showLogo = true,
  showRightIcons = true,
  connectionStatus = 'connected',
  onReconnect = () => {},
  customRight = null,
}) => {
  const navigation = useNavigation();

  // Animação do título
  const [titleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [title]);

  // Renderizar botões da direita (configurações, ajuda)
  const renderRightButtons = () => {
    if (customRight) return customRight;

    if (!showRightIcons) return null;

    return (
      <View style={styles.rightButtons}>
        {connectionStatus !== 'connected' && (
          <TouchableOpacity style={styles.iconButton} onPress={onReconnect}>
            <Icon name="refresh" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Help')}>
          <Icon name="help-circle-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.header}>
      {/* Lado esquerdo: Botão voltar ou logo */}
      <View style={styles.leftSide}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : showLogo ? (
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/nexios-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>

      {/* Título central */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>

      {/* Lado direito: ícones de ação */}
      {renderRightButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f0f13',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftSide: {
    width: 80,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  rightButtons: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default Header;
