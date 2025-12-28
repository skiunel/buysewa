/**
 * eSewa Payment Utilities
 * Frontend signature generation and payment helpers
 */

export interface EsewaPaymentConfig {
  amount: number;
  tax_amount: number;
  transaction_uuid: string;
  product_code: string;
}

/**
 * Create HMAC SHA256 signature for eSewa payment
 * Note: In production, signatures should be generated server-side
 * This is a frontend reference implementation
 */
export async function createEsewaSignatureFrontend(config: EsewaPaymentConfig): Promise<string> {
  const message = `total_amount=${config.amount + config.tax_amount},transaction_uuid=${config.transaction_uuid},product_code=${config.product_code}`;
  const secret = '8gBm/:&EnhH.1/q'; // Test key - should be from backend

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, messageData);

  // Convert to base64
  const signatureArray = Array.from(new Uint8Array(signature));
  return btoa(String.fromCharCode(...signatureArray));
}

/**
 * Format amount for eSewa (rounds to nearest integer)
 */
export function formatAmountForEsewa(amount: number): number {
  return Math.floor(amount);
}

/**
 * Calculate tax amount (10% as per eSewa default)
 */
export function calculateTaxAmount(amount: number): number {
  return Math.floor(amount * 0.1);
}

/**
 * Calculate delivery charge
 */
export function calculateDeliveryCharge(amount: number): number {
  return amount >= 10000 ? 0 : 199;
}

/**
 * Generate unique transaction UUID
 */
export function generateTransactionUuid(): string {
  return `BUYSEWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Submit payment form to eSewa
 */
export function submitEsewaPaymentForm(formUrl: string, formData: Record<string, string>): void {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = formUrl;
  form.style.display = 'none';

  Object.keys(formData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = formData[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

/**
 * Extract payment status from URL parameters
 */
export function extractPaymentStatus(searchParams: URLSearchParams): {
  orderId?: string;
  refId?: string;
  status?: string;
} {
  return {
    orderId: searchParams.get('orderId') || undefined,
    refId: searchParams.get('refId') || undefined,
    status: searchParams.get('status') || undefined
  };
}

/**
 * Validate eSewa response data
 */
export function validateEsewaResponse(data: any): boolean {
  return !!(data && data.transaction_uuid && data.status);
}
