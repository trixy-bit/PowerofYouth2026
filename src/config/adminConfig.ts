// Admin Authentication Configuration
// You can update the credentials below or set environment variables VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in a .env file.

export interface AdminCredential {
  email: string;
  password: string;
  label?: string;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredential[] = [
  {
    email: import.meta.env.VITE_ADMIN_EMAIL || "admin@poy2026.org",
    password: import.meta.env.VITE_ADMIN_PASSWORD || "POY2026#Admin$Secure9842!",
    label: "Primary Administrator",
  },
  {
    email: "superadmin@poy2026.org",
    password: "POY#Youth2026!AuthKey$8831",
    label: "Super Administrator",
  },
];

export function validateAdminCredentials(emailInput: string, passwordInput: string): boolean {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  return DEFAULT_ADMIN_CREDENTIALS.some((cred) => {
    const targetEmail = cred.email.trim().toLowerCase();
    return targetEmail === cleanEmail && cred.password === cleanPassword;
  });
}
