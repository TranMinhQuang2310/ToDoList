import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native'

//Màn hình chờ trước khi vào trang Login
export default function Splash({ navigation }:any) {
    useEffect(() => {
        //Sau 2 giây tự động chuyển qua trang LoginScreen
        setTimeout(() => {
            navigation.replace('LoginScreen')
        },2000)
    },[])


    return (
        <View style={styles.body}>
            <Image
                style={styles.logo}
                source={require('../../assets/images/checklist.png')}
            ></Image>

            <Text 
                style={[
                    styles.text
                ]}>
                To Do List By Quang
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#0080ff'
    },
    logo : {
        width : 150,
        height : 150,
        margin : 20
    },
    text : {
        fontSize : 40,
        color : '#ffffff'
    },
})