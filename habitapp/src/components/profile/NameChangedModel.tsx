import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import useColorStore from '../../store/ColorStore';

const ChangeNameModal = ({ visible, onClose, currentName, onSave }:{ visible:boolean, onClose:()=>void, currentName:any, onSave:any }) => {
  const [name, setName] = useState(currentName || '');
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.Card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentTheme.PrimaryText }]}>
                Change Profile Name
              </Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: currentTheme.SecondoryText }]}>
                Enter your new name
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: currentTheme.Border,
                    backgroundColor: currentTheme.Background,
                    color: currentTheme.PrimaryText
                  }
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Enter new name"
                placeholderTextColor={currentTheme.SecondoryText}
                autoFocus={true}
                maxLength={30}
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: primaryColors.Error }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelButtonText, { color: currentTheme.ButtonText }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: primaryColors.Primary },
                  !name.trim() && styles.disabledButton
                ]}
                onPress={handleSave}
                disabled={!name.trim()}
              >
                <Text style={[styles.saveButtonText,{color:currentTheme.ButtonText}]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    marginLeft: 4,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ChangeNameModal;