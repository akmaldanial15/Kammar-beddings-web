import { Metadata } from 'next'
import { AffiliateLoginClient } from './AffiliateLoginClient'

export const metadata: Metadata = {
  title: 'Log Masuk Portal Ejen Affiliate | KAMAAR Beddings Malaysia',
  description: 'Portal eksklusif rakan niaga affiliate KAMAAR Beddings Malaysia untuk memantau komisen, perkongsian pautan, dan makluman pentadbir.',
}

export default function AffiliateLoginPage() {
  return <AffiliateLoginClient />
}
