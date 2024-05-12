import { View, Text, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import TextComponent from './TextComponent'
import { fontFamilies } from '../constants/fontFamilies'
import { StyleProp } from 'react-native'
import { globalStyles } from '../styles/globalStyles'
import { colors } from '../constants/colors'

interface Props {
    //? nghĩa là có thể có (hoặc không)
    text : string,
    font?: string,
    size?: number,
    color?: string,
    styles?: StyleProp<TextStyle>,
    height?: number,
    flex?: number,
    line?: number
    
}

//Dựng hàm chung làm title
const TitleComponent = (props : Props) => {
    const {text,font,size,color,styles,height,flex,line} = props
    return (
        <TextComponent
            line={line}
            size={size ?? 20} 
            font={font ?? fontFamilies.semiBold}
            styles={[
                globalStyles.text,
                {
                    fontFamily : font ?? fontFamilies.bold,
                    fontSize : size ?? 16,
                    lineHeight : height ? height : size ? size + 4 : 20,
                    color : color ? color : colors.text,
                    flex : flex ?? 0,
                    marginBottom : 8
                },
                styles
            ]}
            color={color}
            text={text}
        />
    )
}

export default TitleComponent