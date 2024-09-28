import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verifyEmailTemplate";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
):Promise<any> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Pro Feedback Verification code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {
            success: true,
            message: 'Verification email sent succesfully',
        }
    } catch (emailError) {
        console.error('Error sending verification email:', emailError)
        return {
            success: false,
            message: 'Failed to send verification email',
        }
    }
}