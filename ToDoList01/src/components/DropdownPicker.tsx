import { View, Text, Modal, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SelectModel } from '../models/SelectModel'
import TitleComponent from './TitleComponent'
import RowComponent from './RowComponent'
import { globalStyles } from '../styles/globalStyles'
import TextComponent from './TextComponent'
import { colors } from '../constants/colors'
import { ArrowDown2, SearchNormal, TickCircle } from 'iconsax-react-native'
import ButtonComponent from './ButtonComponent'
import InputComponent from './InputComponent'
import AntDesign  from 'react-native-vector-icons/AntDesign'
import SpaceComponent from './SpaceComponent'

interface Props {
    title?: string
    items: SelectModel[]
    //item người dùng đã chọn
    selected?: string[]
    //khi người dùng chọn thì sẽ có hành động gì đó
    onSelect: (val:string[]) => void
    //Chọn 1 hoặc nhiều item
    multible?: boolean
}

//Phần Dropdown Member trong AddNewTask
//Vào https://jsonplaceholder.typicode.com/users => Tạo user trong firebase
const DropdownPicker = (props : Props) => {
    const {title,items,selected,onSelect,multible} = props

    //Đóng,mở Modal
    const [isVisible,setIsVisible] = useState(false)

    //Tìm kiếm
    const [searchKey,setSearchKey] = useState('')
    const [results, setResults] = useState<SelectModel[]>([])

    const [dataSelected,setDataSelected] = useState<string[]>([])

    useEffect(() => {
        //Chọn item , click Confirm => Khi mở lại Modal vẫn còn tích những dữ liệu đã chọn
        selected && setDataSelected(selected)
    }, [isVisible,selected])

    useEffect(() => {
        //Nếu không có dữ liệu được tìm thấy
        if(!searchKey) {
            //Trả về danh sách rỗng
            setResults([])
        }else{
            const data = items.filter(element => 
                element.label.toLowerCase().includes(searchKey.toLowerCase())
            )

            setResults(data)
        }
    }, [searchKey])

    //Tích chọn dữ liệu
    const handleSelectItem = (id : string) => {
        //Nếu truyền multible vào thì AddNewTask thì cho tích nhiều , còn không truyền thì cho tích 1
        if (multible) {
            //Tạo ra 1 biến data copy bởi vì dataSelected là 1 mảng , khi setDataSelected lại thì mới ghi nhận thay đổi
            const data = [...dataSelected]
            //Kiểm tra trong biến data có id chưa
            const index = data.findIndex(element => element === id)

            //Nếu trong biến data có id rồi
            if(index !== -1) {
                //1 là lấy ra 1 id
                data.splice(index,1)
            } else {
                //Nếu trong biến data chưa có id
                data.push(id)
            }

            setDataSelected(data)
        } else {
            setDataSelected([id])
        }
    }

    //Nút Confirm
    const handleConfirmSelect = () => {
        //Lấy ra ID của các User đã chọn
        onSelect(dataSelected)

        //Đóng Modal
        setIsVisible(false)
        //Reset không còn tích những dữ liệu đã chọn
        setDataSelected([])
    }



    //Hàm xóa item đã chọn
    const handleRemoveItemSelected = (index : number) => {
        //Nếu item đã được chọn
        if(selected) {
            //Loại bỏ item ra khỏi mảng
            selected.splice(index,1)

            onSelect(selected)
        }
    }
    //Render các item đã chọn
    const renderSelectedItem = (id: string , index : number) => {
        const item = items.find(element => element.value === id)

        return (
            item && (
                <RowComponent
                    onPress={() => handleRemoveItemSelected(index)}
                    key={id}
                    styles={{
                        marginRight : 4,
                        padding : 4,
                        borderRadius : 100,
                        borderWidth : 0.5,
                        borderColor : colors.gray2,
                        marginBottom : 8
                    }}
                    
                >
                    <TextComponent text={item.label} flex={0} />
                    <SpaceComponent width={8} />
                    {/* Icon Xóa */}
                    <AntDesign name='close' size={14} color={colors.text} />
                </RowComponent>
            )
        )
    }


    //console.log(items)
    return (
        <View style={{marginBottom : 16}}>
            {title && <TitleComponent text={title} />}
            <RowComponent
                onPress={() => setIsVisible(true)}
                styles={[
                    globalStyles.inputContainer,
                    {marginTop : title ? 8 : 0, paddingVertical : 16}]}
            >
                <View style={{flex : 1,paddingRight : 12}}>
                    {
                        selected && selected?.length > 0 
                        ?
                        <RowComponent 
                            justify='flex-start'
                            styles={{flexWrap : 'wrap'}}
                        >
                            {selected.map((id,index) => renderSelectedItem(id,index))}
                        </RowComponent>
                        :
                        <TextComponent text='Select' color={colors.gray2} flex={0} />
                    }
                </View>
                <ArrowDown2 size={20} color={colors.text} />
            </RowComponent>

            {/* Mở popup Modal sau khi click */}
            <Modal
                visible={isVisible}
                style={{flex : 1}}
                //Trong suốt
                transparent
                //Chạy từ dưới lên trên
                animationType='slide'
                //Cho phép tràn luôn phần statusBar
                statusBarTranslucent
            >
                <View style={[globalStyles.container,
                {
                    padding : 20,
                    paddingTop: 60,
                    paddingBottom : 60,
                }
                ]}>
                    {/* Lấy danh sách Data từ Firebase trong Firestore Database */}
                    <FlatList
                        //Ẩn thanh scroll
                        showsVerticalScrollIndicator={false}
                        //Thanh seach
                        ListHeaderComponent={
                            <RowComponent 
                                styles={{alignItems : 'center', justifyContent : 'center'}}
                            >
                                <View style={{flex : 1 , marginRight : 12}}>
                                    <InputComponent
                                        value={searchKey}
                                        onChange={val => setSearchKey(val)}
                                        placeholder="Search..."
                                        prefix={<SearchNormal size={22} color={colors.gray2}
                                        />}
                                        allowClear
                                    />
                                </View>
                                <TouchableOpacity onPress={() => setIsVisible(false)}>
                                    <TextComponent text='Cancel' color='coral' flex={0} />
                                </TouchableOpacity>
                            </RowComponent>
                        }
                        style={{flex : 1}}
                        //Nếu không có tìm kiếm => trả về danh sách
                        //Nếu có tìm kiếm => trả về kết quả theo dữ liệu được nhập
                        data={searchKey ? results : items}
                        renderItem={({item}) => (
                            <RowComponent 
                                //Gọi hàm nhấn vào dữ liệu
                                onPress={() => handleSelectItem(item.value)}
                                key={item.value}
                                styles={{paddingVertical : 16}}
                            >
                                {/* Lấy label */}
                                <TextComponent 
                                    size={16} 
                                    text={item.label}
                                    //Khi nhấn vào chữ => chuyển màu
                                    color={
                                        dataSelected.includes(item.value) ? 'coral' : colors.text
                                    } 
                                />
                                {/* Khi nhấn vào chữ => hiển thị icon */}
                                {dataSelected.includes(item.value) && (
                                    <TickCircle size={22} color='coral' />
                                )}
                            </RowComponent>
                        )} 
                    />
                    {/* Nút Confirm */}
                    <ButtonComponent text='Confirm' onPress={handleConfirmSelect} />
                </View>

            </Modal>
        </View>
    )
}

export default DropdownPicker