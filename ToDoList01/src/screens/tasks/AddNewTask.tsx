import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import TextComponent from '../../components/TextComponent'
import { Attachment, TaskModel } from '../../models/TaskModel'
import SectionComponent from '../../components/SectionComponent'
import InputComponent from '../../components/InputComponent'
import { colors } from '../../constants/colors'
import { AttachSquare, User } from 'iconsax-react-native'
import DateTimePickerComponent from '../../components/DateTimePickerComponent'
import RowComponent from '../../components/RowComponent'
import SpaceComponent from '../../components/SpaceComponent'
import DropdownPicker from '../../components/DropdownPicker'
import { SelectModel } from '../../models/SelectModel'
import firestore from '@react-native-firebase/firestore'
import ButtonComponent from '../../components/ButtonComponent'
import TitleComponent from '../../components/TitleComponent'
import DocumentPicker, {
    DocumentPickerResponse,
    DocumentPickerOptions
}  from 'react-native-document-picker'
import storage from '@react-native-firebase/storage'
import { Alert } from 'react-native'
import UploadFileComponent from '../../components/UploadFileComponent'
import { fontFamilies } from '../../constants/fontFamilies'
import auth from '@react-native-firebase/auth'
import { HandleNotification } from '../../utils/handleNotification'

//Màn hình Add new task

const initValue: TaskModel = {
    title: '',
    description: '',
    dueDate: undefined,
    start: undefined,
    end: undefined,
    uids: [],
    attachments: [],
    createdAt : Date.now(),
    updatedAt : Date.now(),
    isUrgent : false
}

const AddNewTask = ({navigation , route}: any) => {
    //Gọi ra từ file HomeScreen.tsx
    const {editable , task} : {editable : boolean ; task?: TaskModel} = route.params
    const [taskDetail,setTaskDetail] = useState<TaskModel>(initValue)

    const [usersSelect, setUsersSelect] = useState<SelectModel[]>([])

    //Hàm dùng cho Attachments
    const [attachments,setAttachments] = useState<Attachment[]>([])

    const user = auth().currentUser;
    
    useEffect(() => {
        handleGetAllUsers()
    },[])

    useEffect(() => {
        user && setTaskDetail({...taskDetail, uids: [user.uid]});
    }, [user]);

    //Click icon bút từ màn hình HomeScreen để Get dữ liệu đã tạo
    useEffect(() => {
        task && setTaskDetail({
            ...taskDetail,
            title : task.title,
            description : task.description,
            uids : task.uids,
        })
    }, [task])

    //Get dữ liệu từ Firebase
    const handleGetAllUsers = async () => {
        //users là tên collection trên firebase (phần Firestore Database)
        await firestore()
            .collection('users')
            .get()
            .then(snap => {
                //Nếu không có dữ liệu
                if(snap.empty) {
                    console.log(`users data not found`)
                }else{
                    //Nếu có dữ liệu
                    const items : SelectModel[] = []

                    snap.forEach(item => {
                        items.push({
                            label : item.data().displayName,
                            value: item.id
                        })
                    })

                    setUsersSelect(items)
                }
            })
            .catch((error:any) => {
                console.log(`Can not get users, ${error.message}`)
            })
    }

    const handleChangeValue = (id : string , value : string | string[] | Date) => {
        const item: any = {...taskDetail}

        item[`${id}`] = value

        setTaskDetail(item)
    }
 
    //Trường hợp gặp lỗi storage/unknow trên android sau khi upload file thì cài thư viện : yarn add rn-fetch-blob
    console.log(attachments)

    //Hàm xử lý đẩy dữ liệu lên firebase sau khi nhập
    const handleAddNewTask = async () => {
        //Nếu đã đăng nhập => Mới cho tạo task
        if(user) {
            //console.log(taskDetail)
            const data = {
                ...taskDetail,
                attachments,
                createdAt : task ? task.createdAt : Date.now(),
                updatedAt : Date.now(),
            }

            //console.log(data)
            //Nếu có task => cho phép update
            if (task) {
                await firestore().doc(`tasks/${task.id}`).update(data).then(() => {
                    console.log('Task updated!!!')
                    Alert.alert('Task updated!!!')
                    if(usersSelect.length > 0) {
                        usersSelect.forEach(member => {
                            member.value !== user.uid &&
                                HandleNotification.SendNotification({
                                    title : 'Update task',
                                    body : `Your task updated by ${user?.email}`,
                                    taskId : task?.id ?? '',
                                    memberId : member.value
                                })
                        })
                    }
                    //Sau khi đẩy lên => back về màn hình Home
                    navigation.goBack()
                })
            }else{
                //Đẩy lên firestore
                //collection => lưu vào collection trên firestore tên là tasks
                //Nếu chưa có task => cho phép tạo mới
                await firestore().collection('tasks').add(data).then((snap) => {
                    console.log('New Task added!!!')
                    Alert.alert('New Task added!!!')
                    if(usersSelect.length > 0) {
                        usersSelect.forEach(member => {
                            member.value !== user.uid &&
                                HandleNotification.SendNotification({
                                    title : 'New task',
                                    body : `Your have a new task asign by ${user?.email}`,
                                    taskId : snap.id,
                                    memberId : member.value
                                })
                        })
                    }
                    //Sau khi đẩy lên => back về màn hình Home
                    navigation.goBack()
                })
                .catch(error => console.log(error)) 
            }  
        } else {
            Alert.alert('You not login !!!')
        }    
    }
    
    return (
        //back => nghĩa là quay về
        //Cài thư viện yarn add @react-navigation/native
        //Cài thư viện yarn add @react-navigation/native-stack
        //Cài thư viện yarn add react-native-screens
        //Cài thư viện yarn add react-native-screens react-native-safe-area-context
        //Cài thư viện yarn add @react-navigation/stack
        //Cài thư viện yarn add react-native-gesture-handler
        <Container back title='Add new task' isScroll>
            <SectionComponent>
                {/* Title */}
                <InputComponent
                    value={taskDetail.title}
                    onChange={val => handleChangeValue('title',val)}
                    title="Title"
                    allowClear
                    placeholder='Title of task' 
                />

                {/* Description */}
                <InputComponent
                    value={taskDetail.description}
                    onChange={val => handleChangeValue('description',val)}
                    title="Description"
                    allowClear
                    placeholder='Content' 
                    multible
                    numberOfLine={3}
                />

                {/* Due date */}
                {/* Cài thư viện yarn add react-native-date-picker */}
                <DateTimePickerComponent 
                    //Người dùng đã chọn
                    selected={taskDetail.dueDate}
                    //Sau khi người dùng chọn xong sẽ dùng hành động gì đó
                    onSelect={val => handleChangeValue('dueDate',val)} 
                    placeholder='Choice'
                    type='date'
                    title='Due date'
                />

                {/* Start - End */}
                {/* Cài thư viện yarn add react-native-date-picker */}
                <RowComponent>
                    <View style={{flex : 1}}>
                        <DateTimePickerComponent
                            selected={taskDetail.start}
                            type='time'
                            onSelect={val => handleChangeValue('start',val)}
                            title='Start'
                        />
                    </View>
                    <SpaceComponent width={14} />
                    <View style={{flex : 1}}>
                        <DateTimePickerComponent
                            selected={taskDetail.end}
                            type='time'
                            onSelect={val => handleChangeValue('end',val)}
                            title='End'
                        />
                    </View>
                </RowComponent>

                {/* Member */}
                <DropdownPicker
                    selected={taskDetail.uids} 
                    items={usersSelect}
                    onSelect={val => handleChangeValue('uids',val)}
                    title='Member'
                    multible
                />

                {/* Attachments */}
                <View>
                    <RowComponent styles={{
                        alignItems : 'center',
                        justifyContent : 'flex-start'
                    }}>
                        <TextComponent 
                            text='Attachments' 
                            flex={0}
                            font={fontFamilies.bold}
                            size={16}  
                        />
                        <SpaceComponent width={8} />
                        <UploadFileComponent 
                            onUpload={file => file && setAttachments([...attachments,file])}
                        />
                    </RowComponent>
                    {/* Trường hợp nếu đính kèm 1 file => Hiển thị tên file đó */}
                    {
                        attachments.length > 0 &&
                            attachments.map((item,index) => (
                                <RowComponent 
                                    key={`attachment${index}`}
                                    styles={{paddingVertical : 12}}
                                >
                                    <TextComponent text={item.name ?? ''} />
                                </RowComponent>
                            ))
                    }
                </View>
            </SectionComponent>

            {/* Nút Save */}
            <SectionComponent>
                <ButtonComponent 
                    text={task ? 'Update' : 'Save'}
                    onPress={handleAddNewTask} 
                />
            </SectionComponent>
        </Container>
    )
}

export default AddNewTask