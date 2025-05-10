import React from 'react'
import { StyleSheet, Text } from 'react-native'
import useColorStore from '../../store/ColorStore';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const HeaderBar = ({ title }: any) => {

  const currentTheme = useColorStore(state => state.currentTheme);

  return (
    <Text style={[style.header, { color: currentTheme.PrimaryText }]}>{title}</Text>
  )

}

const style = StyleSheet.create({
  header: {
    marginTop:30,
    marginVertical: 15,
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 800,
  }
});

export default HeaderBar
