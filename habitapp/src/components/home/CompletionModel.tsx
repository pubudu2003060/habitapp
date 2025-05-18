import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useColorStore from '../../store/ColorStore';

const CompletionModel = ({modalVisible,setModalVisible}:{modalVisible:boolean,setModalVisible:React.Dispatch<React.SetStateAction<boolean>>}) => {

   const currentTheme = useColorStore(state => state.currentTheme)
    const primaryColors = useColorStore(state => state.primaryColors)
    
  return (
   <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentTheme.Card }]}>
            <Text style={[styles.modalText, { color: currentTheme.PrimaryText }]}>
                Do you want to mark this habit as complete?
            </Text>

            <View style={styles.modalActions}>
                <TouchableOpacity
                    onPress={() => {
                        // You can call complete logic here
                        setModalVisible(false);
                    }}
                    style={[styles.modalButton, { backgroundColor: primaryColors.Primary }]}
                >
                    <Text style={{ color: currentTheme.ButtonText }}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                >
                    <Text style={{ color: '#000' }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>

  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
},
modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
},
modalText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
},
modalActions: {
    flexDirection: 'row',
    gap: 12,
},
modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
},

})

export default CompletionModel
