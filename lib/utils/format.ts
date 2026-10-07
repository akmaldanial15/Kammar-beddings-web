// Malaysian Currency, Date, and Address Formatting Utilities

export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'WP Kuala Lumpur',
  'WP Labuan',
  'WP Putrajaya',
] as const

export const EAST_MALAYSIA_STATES = ['Sabah', 'Sarawak', 'WP Labuan']

/**
 * Formats integer sen to standard Malaysian Ringgit display (e.g. 129900 -> RM1,299.00)
 */
export function formatMYR(sen: number | undefined | null): string {
  if (sen === undefined || sen === null || isNaN(sen)) return 'RM0.00'
  const ringgit = sen / 100
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(ringgit)
    .replace('MYR', 'RM')
    .replace(/RM[\s\u00a0]*/g, 'RM')
}

/**
 * Format date in Asia/Kuala_Lumpur timezone
 */
export function formatDateMY(dateStr: string | Date | undefined): string {
  if (!dateStr) return '-'
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

/**
 * Format datetime in Asia/Kuala_Lumpur timezone
 */
export function formatDateTimeMY(dateStr: string | Date | undefined): string {
  if (!dateStr) return '-'
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export const formatKLDate = formatDateMY
export const formatKLDateTime = formatDateTimeMY

/**
 * Validate 5-digit Malaysian postcode (including leading zeroes, e.g. 05000, 50480, 88000)
 */
export function validateMalaysianPostcode(postcode: string): boolean {
  if (!postcode) return false
  const trimmed = postcode.trim()
  return /^\d{5}$/.test(trimmed)
}

/**
 * Validate Malaysian phone number (e.g. +60123456789 or 0123456789 or 011-12345678)
 */
export function validateMalaysianPhone(phone: string): boolean {
  if (!phone) return false
  const clean = phone.replace(/[\s\-\(\)]/g, '')
  return /^(\+?60|0)1[0-9]{8,9}$/.test(clean)
}

/**
 * Calculate Shipping Cost based on destination, bulky mattress check, and order total
 */
export function calculateShippingFee({
  subtotalSen,
  state,
  hasBulkyItem = false,
  freeShippingPromo = false,
}: {
  subtotalSen: number
  state?: string
  hasBulkyItem?: boolean
  freeShippingPromo?: boolean
}): {
  shippingSen: number
  isFreeShipping: boolean
  label: string
  isComplimentary?: boolean
} {
  if (freeShippingPromo) {
    return { shippingSen: 0, isFreeShipping: true, isComplimentary: true, label: 'Free Shipping (Promotion Applied)' }
  }

  const isEastMalaysia = state ? EAST_MALAYSIA_STATES.includes(state) : false

  if (isEastMalaysia) {
    // East Malaysia logistics: bulky mattress vs parcel
    const fee = hasBulkyItem ? 28000 : 6500 // RM280.00 for mattress sea freight, RM65 for parcel
    return {
      shippingSen: fee,
      isFreeShipping: false,
      isComplimentary: false,
      label: hasBulkyItem ? 'East Malaysia Bulky Mattress Sea Freight' : 'East Malaysia Standard Courier',
    }
  }

  // Peninsular Malaysia: Free for orders over RM200 (20000 sen)
  if (hasBulkyItem || subtotalSen >= 20000) {
    return {
      shippingSen: 0,
      isFreeShipping: true,
      isComplimentary: true,
      label: hasBulkyItem ? 'Penghantaran Percuma Lori Kilang / Kurier' : 'Penghantaran Percuma (Pesanan RM200 ke atas)',
    }
  }

  // Minor accessory delivery
  return {
    shippingSen: 1500, // RM15.00 standard courier
    isFreeShipping: false,
    isComplimentary: false,
    label: 'Kurier Standard Semenanjung (RM15.00)',
  }
}
