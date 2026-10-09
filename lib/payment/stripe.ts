import { PaymentProvider, CreatePaymentSessionParams, PaymentSessionResult } from './provider'
import { chipProvider } from './chip'

/**
 * @deprecated KAMAAR Beddings has migrated to CHIP In Asia (gate.chip-in.asia)
 * for Malaysian FPX Online Banking, Touch 'n Go eWallet, and Card processing.
 * This class delegates all calls to CHIP provider for full backwards-compatibility.
 */
export class StripePaymentProvider implements PaymentProvider {
  name = 'chip'

  async createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
    return chipProvider.createCheckoutSession(params)
  }

  async verifyWebhook(
    rawBody: string,
    signature: string
  ): Promise<{ isValid: boolean; eventType?: string; eventId?: string; payload?: any; orderId?: string }> {
    return chipProvider.verifyWebhook(rawBody, signature)
  }
}

export const stripeProvider = new StripePaymentProvider()
