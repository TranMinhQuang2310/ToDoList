import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { HandleUser } from '../../utils/handleUser'

const SigninScreen = ({navigation} : any) => {
    const  [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const [retypePassword,setRetypePassword] = useState('')
    const [checkPassword, setCheckPassword] = useState() 

    const [isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        //Trường hợp đã nhập Email và Password
        if(email || password) {
            setErrorText('')
        }
    }, [email,password,retypePassword])

    //Câu thông báo lỗi
    const [errorText,setErrorText] = useState('')
    const handleSigninWithEmail = async () => {
        //Trường hợp chưa nhập Email và Password sau đó nhấn Sign In
        if(!email && !password && !retypePassword) {
            setErrorText('Please enter full field!!!')
        }else if(!email){
            setErrorText('Please enter your email!!!')
        }else if(!password){
            setErrorText('Please enter your password!!!')
        }else if(!retypePassword){
            setErrorText('Please enter your retypePassword!!!')
        }else if(password !== retypePassword) {
            setErrorText('Retype Password do not match')
        }else{
            setErrorText('')
            setIsLoading(true)
            await auth()
                .createUserWithEmailAndPassword(email,password)
                .then(userCredential => {
                    const user = userCredential.user
                    HandleUser.SaveToDatabase(user)
                    console.log(user)
                    //Save user to firestore
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
                        text='Sign In'
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

                         {/* Retype Password */}
                         <InputComponent 
                            value={retypePassword}
                            onChange={val => 
                                setRetypePassword(val)
                            }
                            prefix={<Sms size={20} color={colors.desc} />}
                            placeholder='Retype Password'
                            title='Retype Password'
                            isPassword
                        />

                        {/* Hiển thị câu thông báo nếu lỗi */}
                        {errorText && <TextComponent text={errorText} color='coral' flex={0} />}
                    </View>  

                    <ButtonComponent 
                        //Trường hợp nút Button đang loading => Không cho nhấn
                        isLoading={isLoading} 
                        text='Sign In' 
                        onPress={handleSigninWithEmail} 
                    />

                    <SpaceComponent height={20} />

                    <Text style={[globalStyles.text, {textAlign : 'center'}]}>
                        You have an already account?{' '}
                        <Text 
                            style={{color : 'coral'}}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            Login
                        </Text>
                    </Text>
                </SectionComponent>
            </Container>
    )
}

export default SigninScreen