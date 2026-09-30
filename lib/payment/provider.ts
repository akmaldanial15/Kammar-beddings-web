// Payment Provider Interface for LENA SLEEP Platform

export interface CreatePaymentSessionParams {
  orderId: string
  orderNumber: string
  customerEmail: string
  customerName: string
  amountSen: number
  currency?: string
  successUrl: string
  cancelUrl: string
  items: {
    name: string
    quantity: number
    unitPriceSen: number
  }[]
}

export interface PaymentSessionResult {
  sessionId: string
  checkoutUrl: string
  provider: string
}

export interface PaymentProvider {
  name: string
  createCheckoutSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>
  verifyWebhook(rawBody: string, signature: string): Promise<{ isValid: boolean; eventType?: string; eventId?: string; payload?: any; orderId?: string }>
}
