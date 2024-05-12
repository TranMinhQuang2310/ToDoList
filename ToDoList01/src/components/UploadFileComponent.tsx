import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Attachment } from '../models/TaskModel'
import { DocumentUpload } from 'iconsax-react-native'
import { colors } from '../constants/colors'
import DocumentPicker , { DocumentPickerResponse } from 'react-native-document-picker'
import TextComponent from './TextComponent'
import { globalStyles } from '../styles/globalStyles'
import TitleComponent from './TitleComponent'
import SpaceComponent from './SpaceComponent'
import { calcFileSize } from '../utils/calcFileSize'
import RowComponent from './RowComponent'
import { Slider } from '@miblanchard/react-native-slider'
import storage from '@react-native-firebase/storage'

interface Props {
    onUpload : (file : Attachment) => void
}

const UploadFileComponent = (props : Props) => {
    const {onUpload} = props

    const [file,setFile] = useState<DocumentPickerResponse>()
    const [isVisibleModalUpload, setIsVisibleModalUpload] = useState(false)
    const [progressUpload, setProgressUpload] = useState(0)

    //Hàm dùng cho Attachments (Dùng để lưu url sau khi Upload file)
    const [attachmentFile, setAttachmentFile] = useState<Attachment>()

    useEffect(() => {
        file && handleUploadFileToStorage()
    },[file])

    //Hàm sau khi người dùng thêm 1 file mới => đẩy lên Local Storage => trả về 1 link Url => lưu trong phần này
    const handleUploadFileToStorage = () => {
        //Nếu có file
        if(file) {
            setIsVisibleModalUpload(true)
            //Nơi lưu trữ trong Storage (trong máy)
            //document => là thư mục
            const path = `/documents/${file.name}`

            //ref(path) => Gọi đến nơi lưu trữ trong storage
            //putFile(item.uri) => link đến thư mục chứa file
            const res = storage().ref(path).putFile(file.uri)

            res.on('state_changed', task => {
                //Set vào thanh Progress
                setProgressUpload(task.bytesTransferred/task.totalBytes)
            })

            res.then(() => {
                //Lấy địa chỉ download Url
                storage().ref(path).getDownloadURL().then(url => {
                    const data: Attachment = {
                        name : file.name ?? '',
                        url,
                        size : file.size ?? 0
                    }
                    setAttachmentFile(data)
                })
            })
            res.catch(error => console.log(error))
        }
    }

    //Sau khi Upload file xong sẽ tự đóng Modal 
    useEffect(() => {
        //Nếu có file được tải lên
        if(attachmentFile) {
            console.log(attachmentFile)
            onUpload(attachmentFile)
            setIsVisibleModalUpload(false)
            setProgressUpload(0)
            setAttachmentFile(undefined)
        }
    },[attachmentFile])

    return (
        <>
            {/* pick({}) => nghĩa là cho phép đính kèm đủ loại file */}
            <TouchableOpacity onPress={() => DocumentPicker.pick({
                type : [DocumentPicker.types.images],
                //Cho phép chọn nhiều phần tử
                allowMultiSelection : false
            })
                .then(res => {
                    //Chỉ cho hiển thị 1 file
                    setFile(res[0])
                    console.log(res)
                })
                .catch(error => console.log(error))

            }>
                <DocumentUpload size={22} color={colors.white} />
            </TouchableOpacity>

            {/* Mở popup Modal sau khi click */}
            <Modal
                visible={isVisibleModalUpload}
                //Chạy từ dưới lên trên
                animationType='slide'
                style={{flex : 1}}
                //Trong suốt
                transparent
                //Cho phép tràn luôn phần statusBar
                statusBarTranslucent
            >
                <View style={[
                    globalStyles.container,
                    {
                        //80 là độ mờ trong color hex opacity
                        backgroundColor : `${colors.gray}80`,
                        justifyContent : 'center',
                        alignItems : 'center'
                    }
                ]}>
                    <View style={{
                        width : Dimensions.get('window').width * 0.8,
                        height : 'auto',
                        padding : 12,
                        backgroundColor : colors.white,
                        borderRadius : 12
                    }}>
                        <TitleComponent text='Uploading' color={colors.bgColor} flex={0} />
                        <SpaceComponent height={12} />
                        <View>
                            {/* Tên file */}
                            <TextComponent
                                color={colors.bgColor}
                                text={file?.name ?? ''}
                                flex={0} 
                            />
                            {/* Dung lượng file */}
                            <TextComponent
                                color={colors.gray2} 
                                //Gọi hàm calcFileSize để làm tròn số dung lượng
                                text={`${calcFileSize(file?.size as number)}`}
                                size={12}
                                flex={0}
                            />
                        </View>

                        {/* Thanh Slider tiến trình upload file */}
                        <RowComponent>
                            <View style={{flex : 1, marginRight : 12}}>
                                <Slider
                                    value={progressUpload}
                                    renderThumbComponent={() => null}
                                    //Cho thanh rộng ra và bo tròn
                                    trackStyle={{
                                        height : 6,
                                        borderRadius : 100
                                    }}
                                    //Màu khi hoàn thành
                                    maximumTrackTintColor={colors.desc}
                                    //Màu chưa hoàn thành
                                    minimumTrackTintColor={colors.success}
                                />
                            </View>
                            <TextComponent
                                text={`${Math.floor(progressUpload * 100)}%`}
                                color={colors.bgColor} 
                                flex={0}
                            />
                        </RowComponent>
                    </View>
                </View>           
            </Modal>
        </>
    )
}

export default UploadFileComponent