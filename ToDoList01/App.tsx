import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';
import { colors } from './src/constants/colors';
import { fontFamilies } from './src/constants/fontFamilies';
import Router from './src/routers/Router';
import HomeScreen  from './src/screens/homes/HomeScreen'

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgColor} />
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </>
  )
}
export default App


