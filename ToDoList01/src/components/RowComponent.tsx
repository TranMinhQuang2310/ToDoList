import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { globalStyles } from '../styles/globalStyles'

interface Props {
    children : ReactNode,
    //? nghĩa là có thể có (hoặc không)
    justify?: 
        "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined
    
    onPress?: () => void
    styles?: StyleProp<ViewStyle>
}

const RowComponent = (props : Props) => {
    const {children, justify, onPress, styles} = props
    const localStyle = [
        globalStyles.row, 
        {
            //Cấu hình dùng justify để gọi các chỗ khác (thay vì dùng justifyContent)
            //Trường hợp dùng justify sẽ gọi các lệnh đã gắn, ngược lại thì center
            justifyContent : justify ?? 'center'
        },
        styles
    ]
    return onPress ? 
        (
        //Trường hợp có truyền vào onPress thì cho click , còn lại thì không
        <TouchableOpacity 
            style={localStyle}
            onPress={onPress ? () => onPress() : undefined}>{children}
        </TouchableOpacity>
        ) 
        : 
        (
        <View 
            style={localStyle}>
            {children}
        </View>
        )
}

export default RowComponent