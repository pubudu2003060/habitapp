import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import useColorStore from '../../store/ColorStore';
import { AlertButton, CustomAlertProps } from '../../types/Types';

const CustomAlert = ({visible,title,message,buttons = [{ text: 'OK' }],onDismiss}:CustomAlertProps) => {
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return { color: primaryColors.Error };
      case 'cancel':
        return { color: currentTheme.SecondoryText };
      default:
        return { color: primaryColors.Primary };
    }
  };

  const getButtonWeight = (buttonStyle?: string) => {
    return buttonStyle === 'cancel' ? '400' : '600';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.alertContainer, { backgroundColor: currentTheme.Card }]}>
    
              {title && (
                <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>
                  {title}
                </Text>
              )}
              
            
              {message && (
                <Text style={[styles.message, { color: currentTheme.SecondoryText }]}>
                  {message}
                </Text>
              )}
             
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      index !== buttons.length - 1 && styles.buttonBorder,
                      { borderColor: currentTheme.Border }
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        getButtonStyle(button.style),
                        { fontWeight: getButtonWeight(button.style) }
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonBorder: {
    borderBottomWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomAlert;