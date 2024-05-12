import { View, Text, ViewStyle, StyleProp, TextStyle, TouchableOpacity } from 'react-native'
import React from 'react'
import TextComponent from './TextComponent'
import { globalStyles } from '../styles/globalStyles'
import { colors } from '../constants/colors'

interface Props {
  text : string,
  color? : string,
  tagStyles? : StyleProp<ViewStyle>
  textStyles? : StyleProp<TextStyle>
  onPress?: () => void
}

//Dùng ở phần Task Progress (Nút bấm March 3)
const TagComponent = (props : Props) => {

  const {text, textStyles , color , tagStyles , onPress} = props

  return (
    <TouchableOpacity
      onPress={onPress}
      //Nếu có truyền onPress => cho phép bấm
      disabled={!onPress} 
      style={[
        globalStyles.tag , 
        tagStyles,
        {backgroundColor : color ?? colors.blue}
      ]}>
      <TextComponent 
        text={text}
        styles={textStyles} 
      />
    </TouchableOpacity>
  )
}

export default TagComponent