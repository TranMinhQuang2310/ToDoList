import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import TextComponent from './TextComponent'
import { fontFamilies } from '../constants/fontFamilies'
import { colors } from '../constants/colors'

interface Props {
    text : string
    isLoading?: boolean
    onPress: () => void
    color?: string
}


const ButtonComponent = (props : Props) => {

    const {text,onPress,color,isLoading} = props

    return (
        <TouchableOpacity 
            style={{
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : color ? color : colors.blue,
                padding : 14,
                borderRadius : 14
            }}
            disabled={isLoading}
            onPress={onPress}
        >
            {/* //Trường hợp nút Button đang loading => Không cho nhấn */}
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <TextComponent 
                    text={text}
                    flex={0}
                    styles={{textTransform: 'uppercase'}}
                    size={16}
                    font={fontFamilies.semiBold}
                />
            )}

        </TouchableOpacity>
    )
}

export default ButtonComponent