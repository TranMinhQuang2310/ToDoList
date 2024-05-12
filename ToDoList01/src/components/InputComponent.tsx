import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { ReactNode, useState } from 'react'
import TitleComponent from './TitleComponent'
import RowComponent from './RowComponent'
import { globalStyles } from '../styles/globalStyles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../constants/colors'
import { Eye, EyeSlash } from 'iconsax-react-native'

//Dùng cho Ô nhập Input trong AddNewTask.tsx
interface Props {
    value : string,
    onChange : (val:string) => void
    placeholder?: string
    title?: string
    //icon phía trước
    prefix?: ReactNode
    //icon phía sau
    affix?: ReactNode
    //Icon xóa clear all
    allowClear?: boolean
    //Nhiều dòng
    multible?: boolean
    //Dài bao nhiêu dòng
    numberOfLine?: number
    //Nếu nhập password => Chuyển thành ...
    isPassword?: boolean
    color?: string
}
const InputComponent = (props:Props) => {
    const {
        value,
        onChange,
        placeholder,
        title,
        prefix,
        affix,
        allowClear,
        multible,
        numberOfLine,
        isPassword,
        color
    } = props

    //Hiển thị mật khẩu
    const [showPass,setShowPass] = useState(false)

    return (
        <View style={{marginBottom : 16}}>
            {title && <TitleComponent text={title} />}
            <RowComponent 
                styles={[
                    globalStyles.inputContainer,
                    {
                        marginTop : title ? 8 : 0,
                        //Độ dài của dòng
                        minHeight : multible && numberOfLine ? 32 * numberOfLine : 32,
                        paddingVertical : 14,
                        paddingHorizontal : 10,
                        backgroundColor : color ?? colors.gray
                        
                    }
                ]}
            >
                {prefix && prefix}
                <View 
                    style={{
                        flex :1,
                        paddingLeft : prefix ? 8 : 0,
                        paddingRight : affix ? 8 : 0
                    }}
                >
                    <TextInput 
                        style={[
                            globalStyles.text ,
                            {margin : 0, padding : 0, paddingVertical : 0, flex : 1}
                        ]}
                        placeholder={placeholder ?? ''}
                        placeholderTextColor={'#676767'}
                        value={value}
                        onChangeText={val => onChange(val)}
                        //Nhiều dòng
                        multiline={multible}
                        //Dài bao nhiêu dòng
                        numberOfLines={numberOfLine}
                        //Nếu nhập password => Chuyển thành ...
                        secureTextEntry={isPassword ? !showPass : false}

                    />
                </View>
                {affix && affix}

                {/* Nhập vào textInput hiện icon X (Xóa) => Click vào xóa toàn bộ */}
                {allowClear && value && (
                    <TouchableOpacity onPress={() => onChange('')}>
                        <AntDesign name='close' size={20} color={colors.white} />
                    </TouchableOpacity>
                )}

                {/* Icon măt */}
                {
                    isPassword && (
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            {showPass ? (
                                <EyeSlash size={20} color={colors.desc} />
                            ) : (
                                <Eye size={20} color={colors.desc} />
                            )
                        }
                        </TouchableOpacity>
                    )
                }
            </RowComponent>
        </View>
    )
}

export default InputComponent