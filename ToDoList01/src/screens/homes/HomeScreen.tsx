import React, { ReactNode, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import Container from '../../components/Container'
import CardComponent from '../../components/CardComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import { colors } from '../../constants/colors';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';
import { Add, Edit2, Element4, Logout, Notification, SearchNormal }  from 'iconsax-react-native'
import TagComponent from '../../components/TagComponent';
import SpaceComponent from '../../components/SpaceComponent';
import CicularComponent from '../../components/CicularComponent';
import CardImageComponent from '../../components/CardImageComponent';
import AvatarGroup from '../../components/AvatarGroup';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { TaskModel } from '../../models/TaskModel';
import { HandleDateTime } from '../../utils/handleDateTime';
import { monthNames } from '../../constants/appInfos';
import { add0ToNumber } from '../../utils/add0ToNumber';
import { HandleNotification } from '../../utils/handleNotification';

import DeviceInformation from 'react-native-device-info'

const HomeScreen = ({navigation} : any) => {
    const date = new Date()

    //Lấy tên đăng nhập là tên User
    const user = auth().currentUser

    const [isLoading,setIsLoading] = useState(false)
    const [tasks,setTasks] = useState<TaskModel[]>([])
    const [urgenTask, setUrgenTask] = useState<TaskModel[]>([]);

    useEffect(() => {
        getTasks()
        //Sau khi vào app => Lấy FcmToken
        HandleNotification.checkNotificationPersion()
    },[])

    //Hàm lấy dữ liệu từ firestore (Bao gồm Urgent tasks)
    useEffect(() => {
        if(tasks.length > 0) {
            const items = tasks.filter(element => element.isUrgent == true)
            setUrgenTask(items)
        }
    },[tasks])

    //Hàm lấy dữ liệu từ firestore (chưa bao gồm Urgent)
    const getTasks = () => {
        setIsLoading(true)

        //collection => lưu vào collection trên firestore tên là tasks
        firestore()
        .collection('tasks')
        //Lấy điều kiện khi đăng nhập 1 account mới => chỉ hiển thị task của account đó
        .where('uids', 'array-contains', user?.uid)
        //.onSnapshot => Khi tạo 1 task thành công thì hiển thị luôn giá trị (real-time)
        .onSnapshot(snap => {
            //Nếu có dữ liệu
            if(snap) {
                const items: TaskModel[] = []
                snap.forEach((item : any) => {
                    items.push({
                        id : item.id,
                        ...item.data()
                    })
                })
                //sort theo mới nhất -> cũ
                setTasks(items.sort((a,b) => b.createdAt - a.createdAt))
            } else {
                console.log(`tasks not found!`)
            }
            //Không cho quay nữa
            setIsLoading(false)
        })
    }

    //Hàm chuyển đến trang TaskDetail
    const handleMoveToTaskDetail = (id? : string , color?: string) => {
        navigation.navigate('TaskDetail', {
            id,
            color
        })
    }

    

    return (
        <View style={{flex:1}}>
            <Container isScroll>
                {/* Phần trên cùng */}
                <SectionComponent>
                    <RowComponent justify='space-between'>
                        {/* Dùng Iconsax */}
                        {/* Dùng Icon menu */}
                        <Element4 size={24} color={colors.desc} />
                        {/* Dùng Icon Chuông */}
                        <Notification size={24} color={colors.desc} />
                    </RowComponent>     
                </SectionComponent>

                {/* Phần text */}
                <SectionComponent>
                    <RowComponent>
                        <View style={{flex : 1}}>
                            {/* Lấy tên đăng nhập là tên User */}
                            <TextComponent text={`Hi , ${user?.email}`} />
                            <TitleComponent
                                text='Be productive today'
                            /> 
                        </View>
                        {/* Nút Đăng xuất */}
                        <TouchableOpacity onPress={async() => auth().signOut()}>
                            <Logout size={22} color='coral' />
                        </TouchableOpacity>
                    </RowComponent> 
                </SectionComponent>
                
                {/* Search task */}
                <SectionComponent>
                    <RowComponent 
                        styles={[
                            globalStyles.inputContainer
                        ]}
                        onPress={() => navigation.navigate('ListTasks', {
                            tasks
                        })}
                    >
                        <TextComponent color='#696B6F' text='Search task' />
                        {/* Dùng Icon Search */}
                        <SearchNormal size={20} color={colors.desc} />
                    </RowComponent>
                </SectionComponent>

                {/* Task Progress */}
                <SectionComponent>
                    <CardComponent 
                        onPress={() => navigation.navigate('ListTasks', {
                                tasks
                            })}
                    >
                        <RowComponent>
                            <View style={{flex : 1}}>
                                <TitleComponent text='Task Progress' />
                                <TextComponent 
                                    text={`${
                                        //Task thành công / Tổng số task
                                        tasks.filter(
                                            element => element.progress && element.progress === 1
                                        ).length
                                    } / ${tasks.length}`} 
                                />

                                {/* Tag */}
                                <SpaceComponent height={12}  />
                                <RowComponent justify='flex-start'>
                                    <TagComponent
                                        text={`${monthNames[date.getMonth()]} ${add0ToNumber(
                                            date.getDate()
                                        )}`}
                                        onPress={() => console.log('aaa')} 
                                    />
                                </RowComponent>                           
                            </View>
                            <View>
                                {/* Cài thư viện circular progress indicator */}
                                {/* Cài thư viện react-native-reanimated */}
                                {/* Vòng tròn % */}
                                {tasks.length > 0 ? (
                                    <CicularComponent
                                        value=
                                        {
                                            Math.floor((tasks.filter(
                                                element => element.progress && element.progress === 1
                                            ).length / tasks.length) * 100)
                                        }
                                    />
                                ) : (
                                    <>
                                        <CicularComponent
                                            value={0}
                                        />
                                    </>
                                    )
                                }
                                
                            </View>
                        </RowComponent>
                    </CardComponent>
                </SectionComponent>

                {
                    isLoading ? <ActivityIndicator /> 
                    : 
                    tasks.length > 0 
                    ?
                    //3 Card Image 
                    <SectionComponent>

                        {/* See All */}
                        <RowComponent 
                            justify='flex-end'
                            styles={{
                                marginBottom : 16
                            }}
                            onPress={() => navigation.navigate('ListTasks', {
                                tasks
                            })}
                        >
                            <TextComponent size={16} text='See all' flex={0} />
                        </RowComponent>

                        <RowComponent styles={{alignItems : 'flex-start'}}>
                            <View style={{flex : 1}}>
                                {/* Card 1 */}
                                {
                                    tasks[0] && (
                                        <CardImageComponent 
                                            onPress={() => 
                                                handleMoveToTaskDetail(tasks[0].id as string)
                                            }
                                        >
                                            <TouchableOpacity 
                                                style={globalStyles.iconContainer}
                                                onPress={() => 
                                                    navigation.navigate('AddNewTask' , {
                                                        editable : true,
                                                        task : tasks[0]
                                                    }
                                                )}
                                            >
                                                {/* Dùng Icon Edit */}
                                                <Edit2 size={20} color={colors.white} />
                                            </TouchableOpacity>
                                            <TitleComponent text={tasks[0].title} />
                                            <TextComponent 
                                                text={tasks[0].description}
                                                //Hiển thị description tối đa 3 dòng
                                                line={3} 
                                            />
        
                                            {/* Avatar Group */}
                                            <View style={{marginVertical : 28}}>
                                                {/* Avatar */}
                                                <AvatarGroup uids={tasks[0].uids} />
                                                {/* Thanh % */}
                                                {tasks[0].progress &&
                                                tasks[0].progress as number >= 0 ? (
                                                    <ProgressBarComponent 
                                                        percent={
                                                            `${Math.floor(tasks[0].progress * 100)}%`
                                                        } 
                                                        color='#0AACFF'
                                                        size='large' 
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </View>
                                            {
                                                tasks[0].dueDate ? (
                                                    <TextComponent
                                                        text={`Due ${HandleDateTime.DateString(new Date(tasks[0].dueDate.toDate()))}`}
                                                        size={12}
                                                        color={colors.desc} 
                                                    />
                                                ) : (
                                                    <></>
                                                )
                                            }
                                        </CardImageComponent>
                                    )
                                }

                            </View>
                            {/* Bỏ SpaceComponent vào để cách 2 bên */}
                            <SpaceComponent width={16} />
                            <View style={{flex : 1}}>
                                {/* Card 2 */}
                                {
                                    tasks[1] &&
                                    <CardImageComponent
                                        onPress={() => 
                                            handleMoveToTaskDetail(
                                                tasks[1].id as string,
                                                'rgba(33,150,243,0.9)'
                                            )
                                        } 
                                        color='rgba(33,150,243,0.9)'
                                    >
                                        <TouchableOpacity 
                                            style={globalStyles.iconContainer}
                                            onPress={() => 
                                                navigation.navigate('AddNewTask' , {
                                                    editable : true,
                                                    task : tasks[1]
                                                }
                                            )}
                                        >
                                            {/* Dùng Icon Edit */}
                                            <Edit2 size={20} color={colors.white} />
                                        </TouchableOpacity>
                                        <TitleComponent text={tasks[1].title} size={18} />

                                        {/* Avatar */}
                                        {tasks[1].uids && <AvatarGroup uids={tasks[1].uids} />}
                                        {/* Thanh % */}
                                        {
                                            tasks[1].progress ? (
                                                <ProgressBarComponent 
                                                    percent={
                                                        `${Math.floor(tasks[1].progress * 100)}%`
                                                    } 
                                                    color='#A2F068'
                                                    size='large' 
                                                />
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </CardImageComponent>
                                }
                                
                                {/* Bỏ SpaceComponent vào để cách 2 bên */}
                                <SpaceComponent height={16} />
                                {/* Card 3 */}
                                {
                                    tasks[2] &&
                                    <CardImageComponent 
                                        onPress={() => 
                                            handleMoveToTaskDetail(
                                                tasks[2].id as string,
                                                'rgba(18,181,22,0.9)'
                                            )
                                        }
                                        color='rgba(18,181,22,0.9)'
                                    >
                                        <TouchableOpacity 
                                            style={globalStyles.iconContainer}
                                            onPress={() => 
                                                navigation.navigate('AddNewTask' , {
                                                    editable : true,
                                                    task : tasks[2]
                                                }
                                            )}
                                        >
                                            {/* Dùng Icon Edit */}
                                            <Edit2 size={20} color={colors.white} />
                                        </TouchableOpacity>
                                        <TitleComponent text={tasks[2].title} />
                                        <TextComponent 
                                            text={tasks[2].description} 
                                            size={13} 
                                            line={3}
                                        />
                                    </CardImageComponent>
                                }

                            </View>
                        </RowComponent>
                    </SectionComponent> 
                    : 
                    <></>
                }

                {/* Urgents tasks */}
                <SectionComponent>
                    {
                        urgenTask.length > 0 && urgenTask.map(item => (
                            <>
                                <TextComponent 
                                    text='Urgents Tasks'
                                    flex={1}
                                    font={fontFamilies.bold}
                                    size={21} 
                                />
                                <CardComponent 
                                    key={`UrgentTask${item.id}`}
                                    styles={{marginBottom : 12}}
                                    onPress={() => handleMoveToTaskDetail(item.id)}
                                >
                                    <RowComponent>
                                        {/* Cài thư viện circular progress indicator */}
                                        {/* Cài thư viện react-native-reanimated */}
                                        {/* Vòng tròn % */}
                                        <CicularComponent 
                                            value={item.progress ? item.progress * 100 : 0} 
                                            radius={50} 
                                        />
                                        <View style={{flex : 1,justifyContent : 'center', paddingLeft : 12}}>
                                            <TextComponent text={item.title} />
                                        </View>
                                    </RowComponent>
                                </CardComponent>
                            </>                           
                        ))
                    }
                </SectionComponent>    
            </Container>

            {/* Button Add new tasks */}
            <View style={{
                position : 'absolute',
                bottom : 0,
                right : 0,
                left : 0,
                padding : 20,
                justifyContent : 'center',
                alignItems : 'center'

            }}>
                <TouchableOpacity
                    //Khi nhấn vào sẽ không có nhấp nháy
                    activeOpacity={1}
                    //Chuyển sang màn hình AddNewTask
                    onPress={() => navigation.navigate('AddNewTask' , {
                        editable : false,
                        task : undefined
                    })} 
                    style={[
                        globalStyles.row, 
                        {
                            backgroundColor : colors.blue,
                            padding : 10,
                            borderRadius : 100,
                            width : '80%'
                        }
                    ]}
                >
                    <TextComponent text='Add new tasks' flex={0} />
                    {/* Icon + */}
                    <Add size={22} color={colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default HomeScreen