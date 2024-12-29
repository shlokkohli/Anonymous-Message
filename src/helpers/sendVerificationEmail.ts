import { transporter } from '@/lib/nodemailer'
import VerificationEmail from '../../emails/VerificationEmail'
import { render } from '@react-email/render' // this is used to convert react to html
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {

        const emailHTML = await render(VerificationEmail({username, otp: verifyCode})); // the mail template converted from react to html
        
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Mystery message | Verification Code',
            html: emailHTML,
        })

        return {success: true, message: "Verification email sent successfully"}
        
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
    
}