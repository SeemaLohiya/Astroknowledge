/**
 * Update GoDaddy registrant email and resend ICANN verification.
 * Usage: GODADDY_API_KEY=... GODADDY_API_SECRET=... node scripts/fix-domain-verification.mjs
 */
const DOMAIN = "astroknowledge.in";
const NEW_EMAIL = process.env.GODADDY_CONTACT_EMAIL || "eshalohiya45@gmail.com";
const KEY = process.env.GODADDY_API_KEY;
const SECRET = process.env.GODADDY_API_SECRET;
const API = "https://api.godaddy.com/v1";

async function godaddy(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `sso-key ${KEY}:${SECRET}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

function withEmail(contact, email) {
  return { ...contact, email };
}

async function main() {
  if (!KEY || !SECRET) {
    console.error("Missing GODADDY_API_KEY or GODADDY_API_SECRET.");
    process.exit(1);
  }

  const domain = await godaddy("GET", `/domains/${DOMAIN}`);
  console.log(`Current status: ${domain.status}, holdRegistrar: ${domain.holdRegistrar}`);
  console.log(`Current registrant email: ${domain.contactRegistrant.email}`);

  const contacts = {
    contactRegistrant: withEmail(domain.contactRegistrant, NEW_EMAIL),
    contactAdmin: withEmail(domain.contactAdmin, NEW_EMAIL),
    contactBilling: withEmail(domain.contactBilling, NEW_EMAIL),
    contactTech: withEmail(domain.contactTech, NEW_EMAIL),
  };

  console.log(`\nUpdating all contacts to ${NEW_EMAIL}...`);
  await godaddy("PATCH", `/domains/${DOMAIN}/contacts`, contacts);
  console.log("Contacts updated.");

  console.log("Resending ICANN verification email...");
  const verify = await godaddy("POST", `/domains/${DOMAIN}/verifyRegistrantEmail`, {});
  console.log("Verification:", verify);

  const updated = await godaddy("GET", `/domains/${DOMAIN}`);
  console.log(`\nNew registrant email: ${updated.contactRegistrant.email}`);
  console.log(`Status: ${updated.status}, holdRegistrar: ${updated.holdRegistrar}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
