import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../constants/colors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

//Định nghĩa Props dành riêng cho file typescript
interface Props {
    //? nghĩa là có thể có (hoặc không)
    title?: string,
    //back => nghĩa là quay về
    back?: boolean,
    //right => nút bên phải
    right?: ReactNode,
    children?: ReactNode
    //isScroll => scroll màn hình
    isScroll?: boolean
}

const Container = (props: Props) => {
  const {title,back,right,children,isScroll} = props

  const navigation:any = useNavigation()
  return (
    <SafeAreaView style={{flex : 1, backgroundColor : colors.bgColor}}>
      <View style={[globalStyles.container]}>
        {/* Header container */}
        <RowComponent
          styles={{
            paddingHorizontal : 16,
            paddingBottom : 16,
            justifyContent : 'center',
            alignItems : 'center'
          }}
        >
          {back && (
            //Sự kiện click icon bên trái back về màn hình HomeScreen
            <TouchableOpacity onPress={() => navigation.goBack()}>
                {/* Icon back bên trái */}
                <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <View style={{flex : 1 , zIndex : -1}}>
            {title && (
              <TextComponent
                flex={0}
                font={fontFamilies.bold}
                size={16}
                text={title}
                styles={{textAlign : 'center', marginLeft : back ? -24 : 0}} 
              />
            )}
          </View>

        </RowComponent>

        {isScroll ? (
          //Nếu màn hình đó dùng Scroll => Dùng ScrollView
          <ScrollView style={globalStyles.container}>{children}</ScrollView>
        ) : (
          //Nếu màn hình đó không dùng Scroll => Dùng View
          <View style={{flex:1}}>{children}</View>
        ) 
        }
      </View>
    </SafeAreaView>
    
  )
}

export default Container