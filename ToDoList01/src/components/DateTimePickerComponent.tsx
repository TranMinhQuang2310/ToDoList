import { View, Text, Modal, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import TitleComponent from './TitleComponent'
import RowComponent from './RowComponent'
import { globalStyles } from '../styles/globalStyles'
import TextComponent from './TextComponent'
import { colors } from '../constants/colors'
import { ArrowDown2 } from 'iconsax-react-native'
import SpaceComponent from './SpaceComponent'
import DatePicker from 'react-native-date-picker'

interface Props {
    type?: 'date' | 'time' | 'datetime',
    title?: string,
    placeholder?: string,
    //Người dùng đã chọn
    selected?: any,
    //Sau khi người dùng chọn xong sẽ dùng hành động gì đó
    onSelect: (val : Date) => void
}

//Phần Due date và Start - End trong AddNewTask
//Cài thư viện yarn add react-native-date-picker
const DateTimePickerComponent = (props : Props) => {
    const {selected,onSelect,placeholder,title,type} = props

    //Click vào mở Modal Datetime
    const [isVisibleModalDateTime, setIsVisibleModalDateTime] = useState(false)

    //Hiển thị ngày sau khi chọn
    const [date, setDate] = useState(selected ?? new Date())

    return (
        <>
            <View style={{marginBottom : 16}}>
                {title && <TitleComponent text={title} />}
                <RowComponent
                    onPress={() => setIsVisibleModalDateTime(true)} 
                    styles={[
                        globalStyles.inputContainer,
                        {
                            marginTop : title ? 8 : 0 ,
                            paddingVertical : 16
                        }
                    ]}
                >
                    <TextComponent
                        flex={1}
                        text={
                            selected 
                            ? 
                            //Nếu type theo kiểu time
                            type === 'time' 
                            ? 
                            //Hiển thị theo kiểu hh:mm
                            `${selected.getHours()}:${selected.getMinutes()}` 
                            : 
                            //Hiển thị theo kiểu dd/mm/yyyy (nhưng lưu xuống vẫn theo kiểu yyyy/mm/dd)
                            `${selected.getDate()}/${selected.getMonth() + 1}/${selected.getFullYear()}`                            
                            : placeholder 
                            ? 
                            placeholder : ''
                        } 
                        color={selected ? colors.text : '#676767'}
                    />
                    {/* Icon xổ xuống */}
                    <ArrowDown2 size={20} color={colors.text} />

                </RowComponent>
            </View>

            {/* Mở popup Modal sau khi click */}
            <Modal 
                visible={isVisibleModalDateTime} 
                //Trong suốt
                transparent 
                //Chạy từ dưới lên trên
                animationType='slide'
            >
                <View 
                    style={{
                        flex : 1 , 
                        justifyContent : 'center',
                        alignItems : 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Nút trong Modal */}
                    <View style={{
                        margin : 20,
                        width : '90%',
                        backgroundColor : colors.white,
                        padding : 20,
                        borderRadius : 20
                    }}>
                        <View>
                            <DatePicker 
                                //Nếu người dùng truyền type là date thì hiển thị date => ngược lại không truyền gì là datetime
                                mode={type ? type : 'datetime'} 
                                //Nếu không có selected thì lấy ngày hiện tại
                                date={date} 
                                onDateChange={val => setDate(val)}
                                //Chuyển về dạng lịch Việt Nam
                                locale='vi'
                                textColor='black'
                            />
                        </View>
                        
                        {/* Nút Confirm */}
                        <Button
                            title='Confirm'
                            onPress={() => {
                                //Hiển thị ngày hiện tại
                                onSelect(date)
                                //Đóng Modal xuống
                                setIsVisibleModalDateTime(false)
                            }} 
                        />
                        {/* Nút Close */}
                        <Button
                            title='Close'
                            onPress={() => setIsVisibleModalDateTime(false)} 
                        />
                    </View>

                </View>
            </Modal>
        </>
    )
}

export default DateTimePickerComponent