import { View, ImageBackground, TouchableOpacity } from 'react-native'
import React, { ReactNode } from 'react'
import { globalStyles } from '../styles/globalStyles'

interface Props {
    children : ReactNode
    color? : string
    onPress? : () => void
}

//Dùng ở phần 3 card Image
const CardImageComponent = (props : Props) => {
    const {children,color,onPress} = props

    const renderCard = (
        <ImageBackground 
            source={require('../assets/images/card-bg.jpg')}
            style={[globalStyles.card]}
            imageStyle={{borderRadius : 12}}
        >
            <View
                style={[
                    {
                        backgroundColor : color ?? 'rgba(113,77,217,0.8)',
                        borderRadius : 12,
                        flex : 1,
                        padding : 12
                    }
                ]}>
                {children}
            </View>        
        </ImageBackground>
    )
    return onPress ? (
        <TouchableOpacity onPress={onPress}>{renderCard}</TouchableOpacity>
    ) : (
        renderCard
    )
}

export default CardImageComponent