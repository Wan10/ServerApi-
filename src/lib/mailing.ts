import { createTransport } from 'nodemailer';

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'williamdotuan',
        pass: 'cwalkerwanka'
    }
});

export function sendVerifyEmail(activeCode, userId, email) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: '"Omer Driver" <admin@omerdriver.vn',
            to: email,
            subject: 'Omer Driver Signal Verification email',
            html: `
            <div>
                Click to <a href="">HERE</a> verify your account.
                <img src="cid:unique@kreata.ee"/>
                </div>`,
                attachments: [{
                    filename: 'b.png',
                    path: 'https://assets.servedby-buysellads.com/p/manage/asset/id/28536',
                    cid: 'unique@kreata.ee' //same cid value as in the html img src
                }]
        }, (err, info) => {
            if (err) return reject(err);
            resolve(info);
        });
    })
};

//https://myaccount.google.com/lesssecureapps
//https://accounts.google.com/DisplayUnlockCaptcha


// sendVerifyEmail('ádasd', 'ádasdasd', 'williamdotuan@gmail.com')
// .then(console.log)
// .catch(console.log)

//thực thi bằng lệnh: node dist/src/lib/mailing


