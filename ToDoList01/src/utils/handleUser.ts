import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import firestore from '@react-native-firebase/firestore'

//Hàm dùng để gọi bên màn hình SignInScreen
export class HandleUser {
    static SaveToDatabase = async (user:FirebaseAuthTypes.User) => {
        const data = {
            email : user.email ?? '',
            displayName : user.displayName 
                ? user.displayName
                : user.email
                ? user.email.split('@')[0]
                : ''
        }

        try {
            //doc => là document trong firestore
            //set => update dữ liệu
            await firestore().doc(`users/${user.uid}`).set(data).then(() => {
                console.log('User added')
            })
        } catch (error) {
            console.log(error)
        }
    }
}