const emailVerificationTemplate = (name, verifyLink) => {
  const htmlContent = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>PONION - Verify your email</title>
        <style>
          html,body{margin:0;padding:0;height:100%}
          body{background-color:#f4f6f8;font-family:Roboto,Arial,sans-serif;color:#333}
          .container{max-width:600px;margin:28px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(14,30,37,0.08)}
          .header{padding:28px 24px 10px 24px;text-align:center;background:linear-gradient(90deg,#0ea5a1,#7c3aed);color:#fff}
          .logo{font-weight:700;font-size:20px;letter-spacing:0.4px}
          .body{padding:28px 24px}
          .greeting{font-size:18px;margin:0 0 8px}
          .lead{margin:0 0 18px;color:#555;line-height:1.5}
          .btn-wrap{text-align:center;margin:18px 0}
          .btn{display:inline-block;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600}
          .btn-primary{background:#7c3aed;color:#fff}
          .note{font-size:13px;color:#9aa3ad;margin-top:12px}
          .fallback{font-size:13px;color:#6b7280;word-break:break-all}
          .footer{padding:18px 24px;background:#fafafa;font-size:13px;color:#8b949e;text-align:center}
          a{color: white;}
          @media (max-width:480px){.container{margin:12px} .header{padding:20px} .body{padding:20px}}
        </style>
      </head>
      <body>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <div class="container" role="document">
                <div class="header">
                  <div class="logo">PONION</div>
                </div>
                <div class="body">
                  <p class="greeting">Hi ${name},</p>
                  <p class="lead">Thanks for creating an account on PONION. Please verify your email address to finish setting up your account and access all features.</p>
                  <div class="btn-wrap">
                    <a href="${verifyLink}" class="btn btn-primary" target="_blank" rel="noopener">Verify my email</a>
                  </div>
                  <p class="note">If the button doesn't work, copy and paste the link below into your browser:</p>
                  <p class="fallback"><a href="${verifyLink}" target="_blank" rel="noopener" style="color:#1f2937;text-decoration:underline;">${verifyLink}</a></p>
                  <p class="note">This link will expire in {{expiryHours}} hours. If you didn't create an account with PONION, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <div>PONION • Cooking Delicious</div>
                  <div style="margin-top:8px">Need help? Reply to this email or visit our support page.</div>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;
  return htmlContent;
};

module.exports = { emailVerificationTemplate };
