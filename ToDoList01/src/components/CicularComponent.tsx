import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CircularProgress from 'react-native-circular-progress-indicator'
import { colors } from '../constants/colors'
import { fontFamilies } from '../constants/fontFamilies'

interface Props {
    color?: string,
    value : number,
    maxValue? : number
    radius?: number
}

//Dùng ở phần Task Progress (vòng quay %)
{/* Cài thư viện circular progress indicator */}
{/* Cài thư viện react-native-reanimated */}
const CicularComponent = (props:Props) => {
  const {color, value, maxValue, radius} = props
  return (
    <CircularProgress 
      value={value} 
      //Số %
      title={`${value}%`}
      //Hiển thị số %
      showProgressValue={false}
      //Kích thước vòng tròn %
      radius={radius ?? 50}
      //Chỗ có màu 
      activeStrokeColor={color ?? colors.blue} 
      //Chỗ không màu
      inActiveStrokeColor={'#3C444A'}
      titleColor={colors.text}
      //Độ rộng của chỗ có màu 
      activeStrokeWidth={14}
      //Độ rộng của chỗ không màu 
      inActiveStrokeWidth={14}
      titleFontSize={32}
      titleStyle={{
        fontFamily : fontFamilies.semiBold,
        fontSize : 25
      }}
    />
  )

}

export default CicularComponent