/**
 * Email and data obfuscation utilities to protect against scrapers
 */

/**
 * Encodes a string to base64 for obfuscation
 */
export function encodeData(data: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(data).toString('base64');
  }
  return btoa(data);
}

/**
 * Creates obfuscated email data that can be decoded client-side
 */
export function obfuscateEmail(email: string): {
  encoded: string;
  parts: { user: string; domain: string };
} {
  const [user, domain] = email.split('@');
  return {
    encoded: encodeData(email),
    parts: {
      user: encodeData(user),
      domain: encodeData(domain),
    },
  };
}

/**
 * Creates a honeypot field name
 */
export function getHoneypotFieldName(): string {
  return 'website_url_field';
}
