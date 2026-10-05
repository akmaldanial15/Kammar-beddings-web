import { NextResponse } from 'next/server'
import { getPaymentSettings } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const paymentSettings = await getPaymentSettings()

    // Filter only enabled methods and sanitize any private API keys/secrets for public storefront
    const sanitizedMethods = paymentSettings.methods
      .filter((m) => m.enabled)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((m) => ({
        id: m.id,
        name: m.name,
        subtitle: m.subtitle,
        providerType: m.providerType,
        isDefault: m.isDefault,
        badgeIcons: m.badgeIcons,
        description: m.description,
        instructions: m.instructions,
        installmentMonths: m.installmentMonths,
        minAmountSen: m.minAmountSen,
        maxAmountSen: m.maxAmountSen,
        feePercent: m.feePercent,
        fixedFeeSen: m.fixedFeeSen,
        testMode: m.testMode,
        config: m.config ? {
          bankName: m.config.bankName,
          accountName: m.config.accountName,
          accountNumber: m.config.accountNumber,
          qrImageUrl: m.config.qrImageUrl,
        } : undefined,
      }))

    return NextResponse.json({
      success: true,
      expressCheckoutEnabled: paymentSettings.expressCheckoutEnabled,
      enableGooglePay: paymentSettings.enableGooglePay,
      enableApplePay: paymentSettings.enableApplePay,
      defaultMethodId: paymentSettings.defaultMethodId,
      methods: sanitizedMethods,
    })
  } catch (err: any) {
    console.error('Error fetching public payment methods:', err)
    return NextResponse.json({ error: 'Failed to fetch payment methods' }, { status: 500 })
  }
}
