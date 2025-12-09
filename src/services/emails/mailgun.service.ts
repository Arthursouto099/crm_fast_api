import FormData from 'form-data' // form-data v4.0.1
import Mailgun from 'mailgun.js' // mailgun.js v11.1.0
import 'dotenv/config'

export default class EmailService {
  private client

  constructor() {
    const mg = new Mailgun(FormData)
    this.client = mg.client({
      username: 'api',
      key: process.env.API_KEY_MAILGUN!,
      url: process.env.BASE_URL!,
    })
  }

  public async sendEmail({
    to,
    subject,
    text,
    html,
  }: {
    to: string
    subject: string
    text: string
    html: string
  }) {
    return await this.client.messages.create(process.env.SANDBOX_DOMAIN!, {
      from: `Mailgun Sandbox <postmaster@${process.env.SANDBOX_DOMAIN}>`,
      to,
      subject,
      text,
      html,
    })
  }
}
