import { View, Text, StyleProp, TextStyle } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/globalStyles'
import { fontFamilies } from '../constants/fontFamilies'
import { colors } from '../constants/colors'

interface Props {
    //? nghĩa là có thể có (hoặc không)
    text?: string,
    size?: number,
    font?: string,
    color?: string,
    flex?: number,
    styles?: StyleProp<TextStyle>
    line?: number
}

//Dựng hàm chung làm text
const TextComponent = (props : Props) => {
    const {text,font,size,color,flex, styles, line} = props
    return (
        <Text
            numberOfLines={line} 
            style={[
                globalStyles.text, 
                {
                    flex: flex ?? 1, // Mặc định là 1
                    fontFamily : font ?? fontFamilies.regular,
                    fontSize : size ?? 14,
                    textAlign : 'justify',
                    color : color ?? colors.desc
                },
                styles
            ]}
        >
            {text}
        </Text>
    )
}

export default TextComponent