import { monthNames } from "../constants/appInfos"

//Hàm dùng để gọi bên màn hình TaskDetail
export class HandleDateTime {
    //Hàm xử lý Ngày,Tháng,Năm
    static DateString = (num:Date) => {
        const date = new Date(num)

        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    //Hàm xử lý Giờ
    static GetHours = (num:Date) => {
        const date = new Date(num)

        const hour = date.getHours()
        return hour > 12 ? `${hour -12} PM` : `${hour} AM`
    }
}