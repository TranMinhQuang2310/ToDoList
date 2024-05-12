import React, { ReactNode } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fontFamilies';

//Toàn bộ css ở đây
export const globalStyles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : colors.bgColor,
    },
    text : {
        fontSize : 14,
        fontFamily : fontFamilies.regular,
        color : colors.text
    },
    documentImg : {
        marginHorizontal : 4
    },
    row : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },

    inputContainer : {
        backgroundColor : colors.gray,
        borderRadius : 12,
        paddingHorizontal : 8,
        paddingVertical : 10
    },

    section : {
        marginBottom : 16,
        paddingHorizontal : 20
    },
    
    tag : {
        paddingHorizontal : 20 ,
        paddingVertical : 4,
        borderRadius : 100 ,
        backgroundColor : colors.blue
    },

    card : {
        borderRadius : 12
    },

    iconContainer : {
        width : 40,
        height : 40,
        borderRadius : 100,
        backgroundColor : 'rgba(0,0,0,0.2)',
        justifyContent : 'center',
        alignItems : 'center',
        marginBottom : 16
    },

    modal : {
        flex : 1
    },

    modalContainer : {
        padding : 20,
        flex : 1 ,
        backgroundColor : 'rgba(0,0,0,0.7)',
        justifyContent : 'center',
        alignItems : 'center'
    },

    modalContent : {
        width : Dimensions.get('window').width * 0.8,
        padding : 20,
        borderRadius : 12,
        backgroundColor : colors.white
    }
})