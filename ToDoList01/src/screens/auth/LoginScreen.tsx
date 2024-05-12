import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import SectionComponent from '../../components/SectionComponent'
import TextComponent from '../../components/TextComponent'
import TitleComponent from '../../components/TitleComponent'
import { fontFamilies } from '../../constants/fontFamilies'
import InputComponent from '../../components/InputComponent'
import { Sms } from 'iconsax-react-native'
import { colors } from '../../constants/colors'
import ButtonComponent from '../../components/ButtonComponent'
import SpaceComponent from '../../components/SpaceComponent'
import { globalStyles } from '../../styles/globalStyles'
import auth from '@react-native-firebase/auth'

const LoginScreen = ({navigation} : any) => {
    const  [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    //Câu thông báo lỗi
    const [errorText,setErrorText] = useState('')

    const handleLoginWithEmail = async () => {
        //Trường hợp chưa nhập Email và Password sau đó nhấn Sign In
        if(!email || !password) {
            setErrorText('Please enter your email and password!!!')
        } else {
            setErrorText('')
            setIsLoading(true)

            await auth()
            .signInWithEmailAndPassword(email,password)
            .then(userCredential => {
                const user = userCredential.user
                console.log(user)
                setIsLoading(false)
            })
            .catch((error : any) => {
                setIsLoading(false)
                setErrorText(error.message)
            })
        }
    }

    return (
            <Container>
                <SectionComponent styles={{
                    justifyContent : 'center',
                    flex : 1
                }}>
                    <TitleComponent
                        text='Login'
                        size={32} 
                        font={fontFamilies.bold} 
                        styles={{textTransform : 'uppercase', flex : 0, textAlign : 'center'}}       
                    />
                    <View style={{marginVertical : 20}}>
                        {/* Email */}
                        <InputComponent 
                            value={email}
                            onChange={val => setEmail(val)}
                            prefix={<Sms size={20} color={colors.desc} />}
                            placeholder='Email'
                            title='Email'
                            //Nhập vào ô input sẽ hiển thị icon X
                            allowClear
                        />

                        {/* Password */}
                        <InputComponent 
                            value={password}
                            onChange={val => setPassword(val)}
                            prefix={<Sms size={20} color={colors.desc} />}
                            placeholder='Password'
                            title='Password'
                            isPassword
                        />
                        {/* Hiển thị câu thông báo nếu lỗi */}
                        {errorText && <TextComponent text={errorText} color='coral' flex={0} />}
                    </View>  

                    <ButtonComponent 
                        //Trường hợp nút Button đang loading => Không cho nhấn
                        isLoading={isLoading} 
                        text='Login' 
                        onPress={handleLoginWithEmail} 
                    />

                    <SpaceComponent height={20} />

                    <Text style={[globalStyles.text, {textAlign : 'center'}]}>
                        You don't have an account?{' '}
                        <Text 
                            style={{color : 'coral'}}
                            onPress={() => navigation.navigate('SigninScreen')}
                        >
                            Create an account
                        </Text>
                    </Text>
                </SectionComponent>
            </Container>
    )
}

export default LoginScreen