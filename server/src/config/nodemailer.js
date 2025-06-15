import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    service : 'Gmail',
    host : process.env.SMTP_HOST,
    port : parseInt( process.env.SMTP_PORT || '587' ),
    secure : process.env.SMTP_PORT === '465',
    auth:{
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS
    }
})

export { transport } 