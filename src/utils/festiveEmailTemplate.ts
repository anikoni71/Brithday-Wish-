export interface FestiveEmailTemplateParams {
  celebrantName: string;
  designation?: string;
  department?: string;
  birthday?: string;
  specialDayName: string;
  specialDayShortName?: string;
  specialDayIcon?: string;
  specialDayCategory?: string;
  greetingTheme?: string;
  customWish?: string;
  senderPhone?: string;
  senderName?: string;
}

/**
 * Generates an inspiring subject line for festive birthday email
 */
export function generateFestiveSubject(
  celebrantName: string,
  specialDayName: string,
  specialDayIcon: string = '🎉'
): string {
  const icon = specialDayIcon || '🎉';
  const name = celebrantName || 'Valued Teammate';
  
  if (specialDayName.toLowerCase().includes('eid')) {
    return `${icon} Eid Mubarak & Happy Birthday, ${name}! Warm Festive Wishes from IE Central Team 🎂✨`;
  }
  if (specialDayName.toLowerCase().includes('pohela boishakh') || specialDayName.toLowerCase().includes('boishakh') || specialDayName.toLowerCase().includes('bengali')) {
    return `${icon} Shuvo Noboborsho & Happy Birthday, ${name}! Festive Celebrations from IE Central Team 🎂🌺`;
  }
  if (specialDayName.toLowerCase().includes('new year')) {
    return `${icon} Happy New Year & Happy Birthday, ${name}! Double Celebration from IE Central Team 🎂🥂`;
  }
  if (specialDayName.toLowerCase().includes('christmas')) {
    return `${icon} Merry Christmas & Happy Birthday, ${name}! Festive Joy from IE Central Team 🎄🎂`;
  }
  if (specialDayName.toLowerCase().includes('independence') || specialDayName.toLowerCase().includes('victory')) {
    return `${icon} Happy Birthday, ${name}! Proud Festive Celebrations on ${specialDayName} from IE Central Team 🎂🇧🇩`;
  }
  if (specialDayName.toLowerCase().includes('valentine')) {
    return `${icon} Happy Birthday, ${name}! Warm Festive Greetings on ${specialDayName} from IE Central Team 💖🎂`;
  }

  return `${icon} Double Celebration: Happy Birthday, ${name} & Happy ${specialDayName}! 🎉🎂`;
}

/**
 * Generates a warm, highly polished, cross-client compatible HTML Email Template
 */
export function generateFestiveEmailHtml(params: FestiveEmailTemplateParams): string {
  const {
    celebrantName,
    designation = 'IE Central Team Colleague',
    department = 'Industrial Engineering Central',
    birthday = '',
    specialDayName,
    specialDayIcon = '🎉',
    greetingTheme = 'Joy, togetherness, and heartfelt celebrations.',
    customWish,
    senderPhone = '+8801625299521',
    senderName = 'IE Central Team Leadership',
  } = params;

  const defaultWish = `On this wonderfully auspicious day coinciding with ${specialDayName}, we send you our warmest, happiest birthday wishes! May your year ahead be blessed with good health, immense happiness, personal fulfillment, and outstanding milestones across all your professional endeavors.`;
  const resolvedWish = customWish && customWish.trim().length > 0 ? customWish.trim() : defaultWish;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Festive Birthday Wishes</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);">
    
    <!-- Top Warm Festive Header Gradient -->
    <tr>
      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%); padding: 36px 28px 30px; text-align: center; color: #ffffff;">
        
        <!-- Top Floating Festive Badge -->
        <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 16px auto;">
          <tr>
            <td style="background: rgba(251, 191, 36, 0.18); border: 1px solid rgba(251, 191, 36, 0.5); border-radius: 999px; padding: 6px 16px; text-align: center;">
              <span style="font-size: 13px; font-weight: 700; color: #fde047; text-transform: uppercase; letter-spacing: 0.5px;">
                ${specialDayIcon} Double Celebration • ${specialDayName}
              </span>
            </td>
          </tr>
        </table>

        <!-- Festive Title & Emojis -->
        <div style="font-size: 42px; line-height: 1; margin-bottom: 12px;">🎉🎂${specialDayIcon}✨</div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; line-height: 1.25;">
          Happy Birthday, <span style="color: #fbbf24;">${celebrantName}</span>!
        </h1>
        
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #e2e8f0; font-weight: 500;">
          ${designation} &bull; ${department}
        </p>

        ${birthday ? `
        <div style="margin-top: 14px; display: inline-block; background: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 4px 14px; font-size: 12px; color: #cbd5e1; font-weight: 600;">
          🎂 Birthday Date: ${birthday}
        </div>` : ''}
      </td>
    </tr>

    <!-- Festive Coincidence Banner -->
    <tr>
      <td style="background-color: #fef3c7; border-bottom: 1px solid #fde68a; padding: 14px 24px; text-align: center;">
        <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600; line-height: 1.4;">
          🌟 <strong>Special Festive Occasion:</strong> Celebrating your birthday alongside <strong>${specialDayName}</strong>!
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #b45309;">
          <em>"${greetingTheme}"</em>
        </p>
      </td>
    </tr>

    <!-- Body Content Area -->
    <tr>
      <td style="padding: 32px 28px 24px 28px; color: #334155; line-height: 1.65; font-size: 15px;">
        
        <p style="margin-top: 0; font-size: 16px; color: #0f172a;">
          Dear <strong>${celebrantName}</strong>,
        </p>

        <!-- Main Warm Wishes Quote Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0;">
          <tr>
            <td style="background: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 0 14px 14px 0; padding: 20px 22px; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
              <div style="font-size: 13px; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                💌 Warm Festive Wishing Message
              </div>
              <div style="font-size: 15px; color: #0f172a; line-height: 1.65; font-style: normal; font-weight: 500;">
                "${resolvedWish}"
              </div>
            </td>
          </tr>
        </table>

        <p style="margin: 18px 0 0 0; font-size: 14px; color: #475569;">
          Your energy, dedication, and positive presence make an invaluable difference in our team every single day. We hope this festive season brings you and your family abundant peace, joy, and prosperity!
        </p>

        <!-- Celebrant Spotlight Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 24px; background-color: #f1f5f9; border-radius: 12px; padding: 14px 18px;">
          <tr>
            <td>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="36" valign="middle" style="font-size: 24px;">🎂</td>
                  <td valign="middle" style="padding-left: 8px;">
                    <div style="font-size: 13px; font-weight: 700; color: #1e293b;">Central Team Celebration Spotlight</div>
                    <div style="font-size: 12px; color: #64748b;">Industrial Engineering Central Team &bull; KDS Group</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer Signature & Contact -->
    <tr>
      <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 28px; font-size: 12px; color: #64748b;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div style="font-weight: 700; color: #334155; font-size: 13px; margin-bottom: 4px;">
                ${senderName}
              </div>
              <div>Industrial Engineering Central &bull; Automated Wishing Engine</div>
              <div style="margin-top: 4px; color: #94a3b8;">
                📱 Sender Phone: <strong style="color: #64748b;">${senderPhone}</strong>
              </div>
            </td>
            <td align="right" valign="middle">
              <span style="display: inline-block; background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700;">
                ✓ Verified Festive Wish
              </span>
            </td>
          </tr>
        </table>
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #e2e8f0; text-align: center; color: #94a3b8; font-size: 11px;">
          This warm festive wishing message was automatically generated & dispatched for the IE Central Team.
        </div>
      </td>
    </tr>

  </table>
</body>
</html>`;
}
