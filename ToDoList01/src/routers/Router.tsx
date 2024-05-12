import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/homes/HomeScreen'
import AddNewTask from '../screens/tasks/AddNewTask'
import SearchScreen from '../SearchScreen'
import auth from '@react-native-firebase/auth'
import LoginScreen from '../../src/screens/auth/LoginScreen'
import SigninScreen from '../../src/screens/auth/SigninScreen'
import TaskDetail from '../screens/tasks/TaskDetail'
import ListTasks from '../screens/tasks/ListTasks'
import Splash from '../screens/tasks/Splash'


//Di chuyển giữa các màn hình 

const Router = () => {

    //Người dùng chưa đăng nhập
    const [isLogin,setIsLogin] = useState(false)

    useEffect(() => {
        auth().onAuthStateChanged(user => 
            {
                if(user) {
                    //Người dùng đã đăng nhập
                    setIsLogin(true)
                }else{
                    setIsLogin(false)
                }
            }
        )
    })
    
    const Stack = createNativeStackNavigator()

    //Để MainRouter là màn hình người dùng đã đăng nhập
    const MainRouter = (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='HomeScreen' component={HomeScreen} />
            <Stack.Screen name='AddNewTask' component={AddNewTask} />
            <Stack.Screen name='SearchScreen' component={SearchScreen} />
            <Stack.Screen name='TaskDetail' component={TaskDetail} />
            <Stack.Screen name='ListTasks' component={ListTasks} />
        </Stack.Navigator>
    )

    //Màn hình LoginScreen là màn hình người dùng chưa đăng nhập
    const AuthRouter = (
        <Stack.Navigator
            initialRouteName='Splash'
            screenOptions={{
                headerShown : false
            }}
        >
            <Stack.Screen name='Splash' component={Splash} />
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
            <Stack.Screen name='SigninScreen' component={SigninScreen} />
        </Stack.Navigator>
    )
    

    return isLogin ? MainRouter : AuthRouter
    //return isLogin ? AuthRouter : MainRouter
}

export default Router