import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import { serverKey } from '../constants/appInfos'

//Lấy thông tin User hiện tại
const user = auth().currentUser

export class HandleNotification {
    static checkNotificationPersion = async () => {
        //Check quyền xem có cho thông báo hay kh
        const authStatus = await messaging().requestPermission()
        //Nếu User cho phép
        if(
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
            this.getFcmToken()
        }

    }

    static getFcmToken = async () => {
        //Lấy FcmToken
        const fcmtoken = await AsyncStorage.getItem('fcmtoken')
        //Nếu thiết bị chưa có fcmtoken
        if(!fcmtoken) {
            //Tiến hành lấy fcmtoken
            const token = await messaging().getToken()
            //Nếu lấy được fcmtoken thành công
            if(token) {
                //Lưu vào trong LocalStorage
                await AsyncStorage.setItem('fcmtoken', token)
                this.UpdateToken(token)
            }
        }
    }

    //Cập nhật token lên firestore sau khi đăng nhập vào app
    static UpdateToken = async (token:string) => {
        await firestore()
            .doc(`users/${user?.uid}`)
            .get()
            .then(snap => {
                if(snap.exists) {
                    const data:any = snap.data()

                    if(!data.tokens || !data.tokens.includes(token)) {
                        firestore()
                            .doc(`users/${user?.uid}`)
                            .update({
                                //arrayUnion => Thêm token vào
                                tokens : firestore.FieldValue.arrayUnion(token)
                            })
                    }
                }
            })
    }

    //Lấy dữ liệu để gửi notification
    static SendNotification = async ({
        memberId,
        title,
        body,
        taskId
    } : {
        memberId : string,
        title : string,
        body : string,
        taskId : string
    }) => {
        try {
            const member: any = await firestore().doc(`users/${memberId}`).get()
            if(member && member.data().tokens) {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                //serverKey => lấy từ bên file appInfo.ts
                myHeaders.append('Authorization', `key=${serverKey}`);

                var raw = JSON.stringify({
                    registration_ids: member.data().tokens,
                    notification : {
                        title,
                        body
                    },
                    data: {
                        taskId,
                    },
                });

                const requestOptions : any = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
            }
            
        } catch (error) {
            console.log(error)
        }
    }
}