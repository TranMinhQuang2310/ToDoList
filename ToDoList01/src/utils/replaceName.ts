//Chuyển sang tiếng việt có dấu => Dùng trong thanh Search thuộc phần ListTask
export const replaceName = (str: string) => {
    return str
      .normalize('NFD')
      .toLocaleLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/ /g, '-')
      .replace(/[:!@#$%^&*()?;/]/g, '')
}