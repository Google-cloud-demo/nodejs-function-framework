import { Response } from 'express';
import emailServices from '../../services/email/email.services';

const sendSupportMail =  async (req: any, res: Response) => {
    try {
        const { message, email } = req.body;

        let body = `<!doctype html>
        <html>
            <head><meta charset="utf-8"></head>
            <body>
                <p><b>Hello,</b></p>
                <p>${message}</p><br/>
                <div style="margin-bottom: 18px;">
                    <p style="margin: 0;">Email: ${email}</p>
                    <p style="margin: 0;">Tenat ID: ${req.tenant}</p>
                    <p style="margin: 0;">Environment: ${process.env.ENV}</p>
                </div>
                <h4 style="margin: 0;">Warms Regards</h4>
                <h4 style="margin: 0;">OmniCore</h4>
            </body>
        </html>`;

        const emailData: any = {
            username: 'rmohammed@korewireless.com',
            subject: 'OmniCore Support',
            body
        }

        await emailServices.sendMail(emailData);

        return res.status(200).json({ message: 'Success' })
    } catch (error: any) {
        console.log('Error in sending support mail',error);
        return res.status(500).json({ message: error?.message })
    }
}

export {
    sendSupportMail
}
