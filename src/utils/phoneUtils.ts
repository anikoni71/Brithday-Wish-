export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  if (!clean) return '';

  // Handle Bangladesh numbers missing international prefix
  if (clean.startsWith('01')) {
    clean = '88' + clean; // e.g. 01829870593 -> 8801829870593
  } else if (clean.length === 10 && clean.startsWith('1')) {
    clean = '880' + clean; // e.g. 1829870593 -> 8801829870593
  }

  return clean;
}

export function getWhatsAppWebLink(phone: string, message: string): string {
  const clean = formatWhatsAppNumber(phone);
  if (!clean) return '#';
  return `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(message)}`;
}
