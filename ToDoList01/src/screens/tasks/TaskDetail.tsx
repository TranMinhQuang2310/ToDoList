import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import SectionComponent from '../../components/SectionComponent'
import TextComponent from '../../components/TextComponent'
import { globalStyles } from '../../styles/globalStyles'
import RowComponent from '../../components/RowComponent'
import { AddSquare, ArrowLeft2, CalendarEdit, Clock, DocumentCloud, DocumentUpload, TickCircle, TickSquare } from 'iconsax-react-native'
import { colors } from '../../constants/colors'
import firestore from '@react-native-firebase/firestore'
import { Attachment, SubTask, TaskModel } from '../../models/TaskModel'
import TitleComponent from '../../components/TitleComponent'
import SpaceComponent from '../../components/SpaceComponent'
import AvatarGroup from '../../components/AvatarGroup'
import { HandleDateTime } from '../../utils/handleDateTime'
import CardComponent from '../../components/CardComponent'
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { fontFamilies } from '../../constants/fontFamilies'
import { Slider } from '@miblanchard/react-native-slider'
import ButtonComponent from '../../components/ButtonComponent'
import { Alert } from 'react-native'
import UploadFileComponent from '../../components/UploadFileComponent'
import { calcFileSize } from '../../utils/calcFileSize'
import ModalAddSubTask from '../../modals/ModalAddSubTask'
import { HandleNotification } from '../../utils/handleNotification'
import auth from '@react-native-firebase/auth'


//Dùng ở màn hình detail sau khi click từ Card ở trang Home
const TaskDetail = ({navigation,route} : any) => {
    const user = auth().currentUser

    //Lấy ra id của detail
    const {id,color} : {id : string, color?: string} = route.params
    const [taskDetail,setTaskDetail] = useState<TaskModel>()

    //Số thay đổi khi kéo thanh Progress
    const [progress,setProgress] = useState(0)

    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [subTasks,setSubTasks] = useState<SubTask[]>([])
    //Khi có sự thay đổi về fileUrls/subTasks => Hiển thị nút Updtae
    const [isChanged, setIsChanged] = useState(false)
    
    //Modal Subtask
    const [isVisibleModalSubTask , setIsVisibleModalSubTask] = useState(false)

    //Urgent
    const [isUrgent, setIsUrgent] = useState(false);

    //Nút Delete
    const handleRemoveTask = () => {
        Alert.alert('Confirm' , 'Are you sure , you want delete tasks' , [
            {
                text : 'Cancel',
                style : 'cancel',
                onPress : () => console.log('Cancel task')
            },
            {
                text : 'Delete',
                style : 'destructive',
                onPress : async () => {
                    await firestore().
                        doc(`tasks/${id}`).
                        //delete => xóa task trong thư mục doc
                        delete().
                        then(() => {
                            Alert.alert('Deleted tasks')
                            taskDetail?.uids.forEach(id => {
                                HandleNotification.SendNotification({
                                    title : 'Delete task',
                                    body : `Your task deleted by ${user?.email}`,
                                    taskId : '',
                                    memberId : id
                                })
                            })
                            navigation.goBack()
                        })
                        .catch(error => {
                            console.log(error)
                        }) 
                }
            }
        ])
    }

    useEffect(() => {
        getTaskDetail()
        getSubTaskById()
    },[])

    useEffect(() => {
        if(taskDetail) {
            setProgress(taskDetail.progress ?? 0)
            //Khi thay đổi mà không nhấn UPDATE thì các dữ liệu vừa thêm sẽ không còn hiển thị
            setAttachments(taskDetail.attachments)
            setIsUrgent(taskDetail.isUrgent)
        }
    },[taskDetail])

    //Khi có sự thay đổi về .attachments/subTasks => Hiển thị nút Updtae
    useEffect(() =>  {
        if(
            progress !== taskDetail?.progress || 
            //attachments.length !== taskDetail.attachments.length
            attachments !== taskDetail.attachments
        ) {
            setIsChanged(true)
        } else {
            setIsChanged(false)
        }
    },[progress,taskDetail, attachments])

    //Khi click hoàn thành subTask => cho thanh Progress lên 100%(chưa hoàn thành là 0%)
    useEffect(() => {
        if(subTasks.length > 0) {
            const completedPercent = 
                subTasks.filter(element => element.isCompleted).length/subTasks.length

            setProgress(completedPercent)
        }
    },[subTasks])

    //Khi click vào Urgent => update dữ liệu lên firestore
    const handleUpdateUrgentState = () => {
        firestore().doc(`tasks/${id}`).update({
            isUrgent : !isUrgent,
            updatedAt : Date.now()
        })
    }
    
    //Get Task Detail
    const getTaskDetail = () => {
        //doc là lấy document từ collection 'tasks' trên firestore
        //.onSnapshot => Khi tạo 1 task thành công thì hiển thị luôn giá trị (real-time)
        firestore().doc(`tasks/${id}`).onSnapshot((snap : any) => {
            //Kiểm tra có dữ liệu hay không
            if(snap.exists) {
                setTaskDetail ({
                    id,
                    ...snap.data()
                })
            } else {
                console.log(`Tasks detail not found !!!`)
            }
        })
    }

    //Get Subtask
    const getSubTaskById = () => {
        //collection('subTasks') => Lưu vào collection subTasks trong firestore
        //where => bốc những trường cần lấy
        firestore()
            .collection('subTasks')
            .where('taskId' , '==' , id)
             //.onSnapshot => Khi tạo 1 Subtask thành công thì hiển thị luôn giá trị (real-time)
            .onSnapshot(snap => {
                if(snap.empty) {
                    console.log('Data not found')
                }else{
                    const items : SubTask[] = []
                    snap.forEach((item : any) => {
                        items.push({
                            id : item.id,
                            ...item.data()
                        })
                    })
                    setSubTasks(items)
                }
            })
    }
    //console.log(subTasks)

    //Update dữ liệu Tasks trên firebase
    const handleUpdateTasks = async () => {
        //updateAt : Date.now() => Thời gian hiện tại
        const data = {...taskDetail,progress,attachments , updateAt : Date.now()}

        //doc là lấy document từ collection 'tasks' trên firestore
        await firestore().doc(`tasks/${id}`).update(data).then(() => {
            Alert.alert('Task Update')
            //Sau khi update firebase => back về màn hình Home
            navigation.goBack()
        }).catch(error => console.log(error))
    }
    //console.log(taskDetail)

    //Update dữ liệu SubTasks trên firebase
    const handleUpdateSubTask = async (id : string , isCompleted : boolean) => {
        try {
            await firestore()
                //doc là lấy document từ collection 'subTasks' trên firestore
                .doc(`subTasks/${id}`)
                .update({isCompleted: !isCompleted})
        } catch (error) {
            console.log(error)
        }
    }

    return taskDetail ? (
        <>
            <ScrollView style={{flex : 1, backgroundColor : colors.bgColor}}>
                {/* Header */}
                <SectionComponent styles={{
                    backgroundColor : color ?? 'rgba(113,77,217,0.8)',
                    paddingVertical : 20,
                    paddingTop : 28,
                    borderBottomLeftRadius : 20,
                    borderBottomRightRadius : 20,
                }}>
                    <RowComponent>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft2 size={28} color={colors.text} />
                        </TouchableOpacity>

                        <SpaceComponent width={12} />
                        <TitleComponent 
                            size={22}
                            //Tối đa 3 dòng => Dài quá hiển thị ...
                            line={3} 
                            text={taskDetail.title} 
                            flex={1} 
                            styles={{marginBottom : 0}}
                        />
                    </RowComponent>

                    <View style={{marginTop : 20}}>
                        <TextComponent text='Due date' />
                        <RowComponent styles={{marginTop : 8}}>
                            {/* Giờ */}
                            <RowComponent styles={{flex : 1}}>
                                <Clock size={18} color={colors.text} />
                                <SpaceComponent width={8} />
                                <TextComponent 
                                    text={`${HandleDateTime.GetHours(taskDetail.start?.toDate())}-${HandleDateTime.GetHours(taskDetail.end?.toDate())}`
                                    } 
                                />
                            </RowComponent>

                            {/* Ngày */}
                            {
                                taskDetail.dueDate && (
                                    <RowComponent styles={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                                        <CalendarEdit size={18} color={colors.white} />

                                        <SpaceComponent width={4} />
                                        <TextComponent
                                            flex={0} 
                                            text={
                                                HandleDateTime.DateString(taskDetail.dueDate.toDate()) ?? ''
                                            } 
                                        />
                                    </RowComponent>
                                )
                            }

                            {/* Avatar */}
                            <RowComponent styles={{flex : 1 , alignItems : 'flex-end'}}>
                                <AvatarGroup uids={taskDetail.uids} />
                            </RowComponent>
                        </RowComponent>
                    </View>
                    
                </SectionComponent>

                {/* Description */}
                <SectionComponent>
                    <TitleComponent text='Description' size={22} />
                    <CardComponent 
                        bgColor={colors.bgColor}
                        styles={{
                            borderWidth : 1, 
                            borderColor : colors.gray, 
                            borderRadius : 12,
                            marginTop : 12
                        }}>
                        <TextComponent text={taskDetail.description} />
                    </CardComponent>
                </SectionComponent>

                {/* Files & Links */}
                <SectionComponent>
                    <RowComponent>
                        <TitleComponent text='Files & Links' flex={1} />
                        {/* Upload file lên storage của Firebase */}
                        <UploadFileComponent
                            onUpload={file => file && setAttachments([...attachments, file])} 
                        />
                    </RowComponent>
                    {/* Show tên file sau khi Upload thành công */}
                    {attachments.map((item,index) => (
                        <View 
                            style={{
                                justifyContent : 'flex-start',
                                marginBottom : 8,
                            }}
                            key={`attachment${index}`}
                        >
                            <TextComponent flex={0} text={item.name} />
                            <TextComponent 
                                flex={0} 
                                text={calcFileSize(item.size)}
                                size={12} 
                            />
                        </View>
                    ))}
                </SectionComponent>

                {/* Urgents */}
                <SectionComponent>
                    <RowComponent onPress={handleUpdateUrgentState}>
                        <TickSquare 
                            size={24} 
                            color={colors.white} 
                            variant={isUrgent ? 'Bold' : 'Outline'}
                        />
                        <SpaceComponent width={8} />
                        <TextComponent
                            flex={1}
                            text={`Is Urgent`}
                            font={fontFamilies.bold}
                            size={18} 
                        />
                    </RowComponent>
                </SectionComponent>

                {/* Progress */}
                <SectionComponent>
                    <RowComponent>
                        <View style={{
                                width : 24,
                                height : 24,
                                borderRadius : 100,
                                borderWidth : 2,
                                borderColor : colors.success,
                                marginRight : 4,
                                justifyContent : 'center',
                                alignItems : 'center'
                            }}>
                            <View style={{
                                backgroundColor : colors.success,
                                width : 16,
                                height : 16,
                                borderRadius : 100
                            }}>
                            </View>
                        </View>
                        <TextComponent
                            flex={1} 
                            text="Progress"
                            font={fontFamilies.medium}
                            size={18}
                        />
                    </RowComponent>
                    <SpaceComponent height={12} />
                    <RowComponent>
                        <View style={{flex : 1}}>
                            {/* Thanh slider */}
                            <Slider 
                                disabled
                                value={progress}
                                //Số thay đổi khi kéo thanh Progress 
                                onValueChange={val => setProgress(val[0])}
                                //Màu cục kéo
                                thumbTintColor={colors.success}
                                //Màu khi hoàn thành
                                maximumTrackTintColor={colors.gray2}
                                //Màu chưa hoàn thành
                                minimumTrackTintColor={colors.success}
                                //Cho thanh rộng ra và bo tròn
                                trackStyle={{height : 10, borderRadius : 10}}
                                //Custom cho cục kéo
                                thumbStyle={{
                                    borderWidth : 2,
                                    borderColor : colors.white
                                }}
                            />
                        </View>
                        <SpaceComponent width={20} />
                        <TextComponent
                            text={`${Math.floor(progress *100)}%`} 
                            flex={0}
                            font={fontFamilies.bold}
                            size={18}
                        />
                    </RowComponent>
                </SectionComponent>

                {/* Sub tasks */}
                <SectionComponent>
                    <RowComponent>
                        <TitleComponent text='Sub tasks' size={20} flex={1} />
                        {/* Icon + */}
                        <TouchableOpacity onPress={() => setIsVisibleModalSubTask(true)}>
                            <AddSquare size={24} color={colors.success} variant="Bold" />
                        </TouchableOpacity>
                    </RowComponent> 
                    <SpaceComponent height={12}/>
                    {/* Danh sách item SubTask */}
                    {
                        subTasks.length > 0 && 
                        subTasks.map((item,index) => (
                            <CardComponent 
                                key={`subtask${index}`}
                                styles={{marginBottom : 12}}
                            >
                                <RowComponent onPress={() => 
                                    handleUpdateSubTask(item.id, item.isCompleted)
                                }>
                                    {/* Icon tick */}
                                    <TickCircle 
                                        //Nếu thành công mới cho Bold
                                        variant={item.isCompleted ? 'Bold' : 'Outline'} 
                                        color={colors.success} 
                                    />
                                    {/* Tiêu đề , Ngày tháng */}
                                    <View style={{flex : 1, marginLeft : 12}}>
                                        <SpaceComponent width={8} />
                                        <TextComponent text={item.title} />
                                        <TextComponent 
                                            text={HandleDateTime.DateString(new Date(item.createdAt))} 
                                            size={12}
                                            color={'#e0e0e0'}
                                        />
                                    </View>
                                </RowComponent>
                            </CardComponent>
                        ))
                    }
                </SectionComponent>

                {/* Nút Delete tasks */}
                <SectionComponent>
                    <RowComponent onPress={handleRemoveTask}>
                        <TextComponent text='Delete task' color='red' flex={0} />
                    </RowComponent>
                </SectionComponent>
            </ScrollView>
            {/* Nút Update */}
            {
                //Khi có sự thay đổi về fileUrls/subTasks => Hiển thị nút Updtae
                isChanged && (
                    <View style={{
                        position : 'absolute',
                        bottom : 20,
                        right : 20,
                        left : 20
        
                    }}>
                        <ButtonComponent 
                            text='Update' 
                            onPress={handleUpdateTasks}
                        />
                    </View>
                )
            }

            {/* Modal SubTask */}
            <ModalAddSubTask 
                visible={isVisibleModalSubTask}
                onClose={() => setIsVisibleModalSubTask(false)}
                taskId={id}
            />
        </>
    ) : (
        <></>
    )
}

export default TaskDetail