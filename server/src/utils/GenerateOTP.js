const generateOTP = (len = 6) => {
    const digit = "1234567890"
    let otp = ""
    for (let index = 0; index < len; index++) {
        otp = otp + digit[Math.floor(Math.random()*10)]
        
    }
    return otp
}

export default generateOTP