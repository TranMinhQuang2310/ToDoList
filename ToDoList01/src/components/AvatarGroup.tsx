import { View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RowComponent from './RowComponent'
import { colors } from '../constants/colors'
import TextComponent from './TextComponent'
import { fontFamilies } from '../constants/fontFamilies'
import firestore from '@react-native-firebase/firestore';
import AvatarComponent from './AvatarComponent'

interface Props {
    uids : string[]
}

//Dùng ở phần Avatar trong 3 card Image
const AvatarGroup = (props : Props) => {
    const {uids} = props

    //Số hiển thị kế avatar
    // const uidsLength = 10
    //Hình avatar
    // const imageUrl = 'https://gamek.mediacdn.vn/133514250583805952/2022/5/18/photo-1-16528608926331302726659.jpg'

    const [usersName, setUsersName] = useState<
    {
      name: string;
      imgUrl: string;
    }[]
  >([]);

    useEffect(() => {
        getUserAvatar();
    }, [uids]);

    const getUserAvatar = async () => {
        const items: any = [...usersName];
        uids.forEach(async id => {
          await firestore()
            .doc(`users/${id}`)
            .get()
            .then((snap: any) => {
              if (snap.exists) {
                items.push({
                  name: snap.data().displayName,
                  imgUrl: snap.data().imgUrl ?? '',
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        });
        setUsersName(items);
      };


    const imageStyle = {
        width : 32,
        height : 32,
        borderRadius : 100,
        borderWidth : 2,
        borderColor : colors.white,
    }
    return (
        <RowComponent styles={{justifyContent : 'flex-start'}}>
        {uids.map(
            (item, index) =>
                index < 3 && <AvatarComponent uid={item} index={index} key={item} />,
        )}

            {/* Số phía sau avatar */}
            {uids.length > 3 && (
                <View 
                key={'total'}
                style={[
                    imageStyle,
                    {
                    backgroundColor: 'coral',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    marginLeft: -10,
                    },
                ]}>
                    {/* Trường hợp nhập uidsLength lớn hơn 9 thì cũng chỉ hiển thị +7 */}
                    <TextComponent
                        flex={0}
                        styles={{
                          lineHeight: 19,
                        }}
                        font={fontFamilies.semiBold}
                        text={`+${uids.length - 3 > 9 ? 9 : uids.length - 3}`}
                    />
                </View>
            )}
        </RowComponent>
    )
}

export default AvatarGroup