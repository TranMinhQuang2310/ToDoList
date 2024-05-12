import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { globalStyles } from '../styles/globalStyles'
import RowComponent from '../components/RowComponent'
import TextComponent from '../components/TextComponent'
import ButtonComponent from '../components/ButtonComponent'
import { colors } from '../constants/colors'
import TitleComponent from '../components/TitleComponent'
import InputComponent from '../components/InputComponent'
import firestore from '@react-native-firebase/firestore'

interface Props {
    //Cho biết Modal đóng hay mở
    visible : boolean
    subTask? : any
    //Đóng Modal xuống
    onClose: () => void
    //ID của subtask
    taskId : string
}

const initValue ={
    title : '',
    description : '',
    isComplete : false
}

const ModalAddSubTask = (props : Props) => {
    const {visible , subTask , onClose, taskId} = props
    const [subTaskForm , setSubTaskForm] = useState(initValue)
    const [isLoading, setIsLoading] = useState(false);
    

    //Lưu dữ liệu xuống firestore
    const handleSaveToDatabase = async () => {
        const data = {
            ...subTaskForm,
            createdAt : Date.now(),
            updatedAt : Date.now(),
            taskId
        }

        setIsLoading(true)
        
        try {
            //collection('subTasks') => Lưu vào collection subTasks trong firestore
            await firestore().collection('subTasks').add(data)
            console.log('Done')
            setIsLoading(false)
            handleCloseModal()
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    //Đóng Modal
    const handleCloseModal = () => {
        setSubTaskForm(initValue)
        onClose()
    }

    return (
        //Mở popup Modal sau khi click 
        <Modal 
            visible={visible}
            style={globalStyles.modal}
            //Trong suốt
            transparent
            //Chạy từ dưới lên trên
            animationType='slide'
        >
            <View style={[globalStyles.modalContainer]}>
                <View style={[globalStyles.modalContent, {
                    backgroundColor : colors.gray
                }]}>
                    <TitleComponent text='Add new Subtasks'/>
                    <View style={{paddingVertical : 16}}>
                        <InputComponent
                            title='Title' 
                            placeholder='Title'
                            color={'#212121'}
                            value={subTaskForm.title}
                            numberOfLine={2}
                            multible
                            onChange={val => setSubTaskForm({
                                ...subTaskForm,
                                title : val
                            })}
                            allowClear
                        />
                        <InputComponent
                            title='Description' 
                            placeholder='Description'
                            color={'#212121'}
                            value={subTaskForm.description}
                            numberOfLine={3}
                            multible
                            onChange={val => setSubTaskForm({
                                ...subTaskForm,
                                description : val
                            })}
                            allowClear
                        />
                    </View>
                    <RowComponent>
                        {/* Nút Close */}
                        <View 
                            style={{flex : 1 , justifyContent : 'center' , alignItems : 'center'}}
                        >
                            <TouchableOpacity onPress={handleCloseModal}>
                                <TextComponent text='Close' flex={0} />
                            </TouchableOpacity>
                        </View>
                        {/* Nút Save */}
                        <View style={{flex : 1}}>
                            <ButtonComponent isLoading={isLoading} text='Save' onPress={handleSaveToDatabase} />
                        </View>
                    </RowComponent>
                </View>
            </View>
        </Modal>
    )
}

export default ModalAddSubTask