import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  LogOut,
  Users,
  CheckCircle,
  MapPin,
  Sparkles,
  Download,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  QrCode,
  Send,
  X,
  Eye,
  EyeOff,
  BarChart2,
  Key,
  Save,
  AlertTriangle,
  ChevronLeft,
  Camera,
  Check,
} from "lucide-react";
import { getSupabase } from "@/supabase";
import { validateAdminCredentials } from "@/config/adminConfig";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  church: string;
  city: string;
  attended: boolean;
  timestamp: string;
  questions?: string;
  prayer_requests?: string;
}

type AdminTab = "overview" | "registrations" | "add" | "scanner" | "tokens";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateRegId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "POY26-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function generateScanToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SCAN-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ─── Input Component ──────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error,
  readOnly = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide uppercase">
        {label} {required && <span className="text-[#c9a84c]">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          rows={3}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none resize-none transition-all ${
            readOnly
              ? "border-white/5 text-white/40 cursor-not-allowed"
              : error
              ? "border-red-500/50 focus:ring-1 focus:ring-red-500/30"
              : "border-white/10 focus:border-[#c9a84c]/40 focus:ring-1 focus:ring-[#c9a84c]/20"
          }`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none transition-all ${
            readOnly
              ? "border-white/5 text-white/40 cursor-not-allowed"
              : error
              ? "border-red-500/50 focus:ring-1 focus:ring-red-500/30"
              : "border-white/10 focus:border-[#c9a84c]/40 focus:ring-1 focus:ring-[#c9a84c]/20"
          }`}
        />
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // brief UX delay
    if (validateAdminCredentials(email.trim(), password.trim())) {
      sessionStorage.setItem("poy_admin_auth", "1");
      setLoading(false);
      onLogin();
    } else {
      setError("Invalid credentials. Access denied.");
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #07090f 0%, #0d1020 50%, #07090f 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#c9a84c]/6 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#c9a84c]/4 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back to site */}
        <a
          href="/"
          className="flex items-center gap-2 text-white/30 hover:text-white/60 text-sm mb-8 transition-colors group w-fit"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to main site
        </a>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(201,168,76,0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Top gold accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

          <div className="p-8">
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                <Shield className="w-7 h-7 text-[#c9a84c]" />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl tracking-tight">Admin Portal</h1>
                <p className="text-white/40 text-xs mt-0.5">Power of Youth 2026 — Restricted Access</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-white/50 text-xs font-mono tracking-widest uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@poy2026.org"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:border-[#c9a84c]/40 focus:ring-1 focus:ring-[#c9a84c]/20 outline-none transition-all text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/50 text-xs font-mono tracking-widest uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/20 focus:border-[#c9a84c]/40 focus:ring-1 focus:ring-[#c9a84c]/20 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 mt-2"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #d4b55f)",
                  color: "#07090f",
                  boxShadow: "0 0 30px rgba(201,168,76,0.25)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#07090f]/30 border-t-[#07090f] rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In as Admin"
                )}
              </button>
            </form>

            <p className="text-white/15 text-xs text-center mt-6 font-mono">
              POY 2026 Admin · Authorised Personnel Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, sub }: { label: string; value: number | string; icon: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:border-[#c9a84c]/20 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#c9a84c]">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white font-['Playfair_Display']">{value}</p>
      <p className="text-white/40 text-xs mt-1">{label}</p>
      {sub && <p className="text-white/20 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────────

function OverviewTab({ regs, loading, onRefresh }: { regs: Registration[]; loading: boolean; onRefresh: () => void }) {
  const stats = {
    total: regs.length,
    attended: regs.filter((r) => r.attended).length,
    cities: [...new Set(regs.map((r) => r.city).filter(Boolean))].length,
    today: regs.filter((r) => r.timestamp?.startsWith(new Date().toISOString().split("T")[0])).length,
  };
  const rate = stats.total ? Math.round((stats.attended / stats.total) * 100) : 0;

  function exportCSV() {
    const csv = [
      "ID,Name,Email,Phone,Age,Church,City,Attended,Questions,Prayer Requests,Date",
      ...regs.map((r) =>
        [
          r.id,
          `"${(r.name || "").replace(/"/g, '""')}"`,
          r.email,
          r.phone,
          r.age,
          `"${(r.church || "").replace(/"/g, '""')}"`,
          `"${(r.city || "").replace(/"/g, '""')}"`,
          r.attended,
          `"${(r.questions || "").replace(/"/g, '""')}"`,
          `"${(r.prayer_requests || "").replace(/"/g, '""')}"`,
          r.timestamp || "",
        ].join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poy2026_registrations.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Registered" value={stats.total} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Attended" value={stats.attended} icon={<CheckCircle className="w-5 h-5" />} sub={`${rate}% attendance rate`} />
        <StatCard label="Cities Represented" value={stats.cities} icon={<MapPin className="w-5 h-5" />} />
        <StatCard label="Registered Today" value={stats.today} icon={<Sparkles className="w-5 h-5" />} />
      </div>

      {/* Attendance progress */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Attendance Rate</h3>
          <span className="text-[#c9a84c] font-mono text-sm font-bold">{rate}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-[#c9a84c] to-[#e8914a] h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${rate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/30 mt-2">
          <span>{stats.attended} attended</span>
          <span>{stats.total - stats.attended} not yet attended</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-white/70 rounded-xl text-sm hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-xl text-sm hover:bg-[#c9a84c]/20 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({
  reg,
  onClose,
  onSaved,
}: {
  reg: Registration;
  onClose: () => void;
  onSaved: (updated: Registration) => void;
}) {
  const [form, setForm] = useState<Registration>({ ...reg });
  const [errors, setErrors] = useState<Partial<Record<keyof Registration, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function set(key: keyof Registration, val: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof Registration, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    const ph = form.phone.trim();
    if (!ph) e.phone = "Required";
    else if (!/^\d{10}$/.test(ph)) e.phone = "Enter 10 digits only";
    else if (!/^[6-9]\d{9}$/.test(ph)) e.phone = "Must start with 6–9";
    if (!form.age) e.age = "Required";
    if (!form.church.trim()) e.church = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setSaveError("");
    const { error } = await getSupabase()
      .from("registrations")
      .update({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        age: form.age,
        church: form.church.trim(),
        city: form.city.trim(),
        questions: form.questions || null,
        prayer_requests: form.prayer_requests || null,
        attended: form.attended,
      })
      .eq("id", reg.id);
    setSaving(false);
    if (error) {
      setSaveError(error.message || "Failed to save changes.");
      return;
    }
    onSaved(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0a0d1a] border border-[#c9a84c]/15 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Edit Registration</p>
              <p className="text-white/30 text-xs font-mono">{reg.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} required />
            <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" error={errors.email} required />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => set("phone", v.replace(/\D/g, "").slice(0, 10))}
              type="tel"
              placeholder="10-digit number"
              error={errors.phone}
              required
            />
            <div>
              <label className="block text-white/50 text-xs font-mono tracking-widest uppercase mb-2">
                Age Group <span className="text-[#c9a84c]">*</span>
              </label>
              <select
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all ${
                  errors.age ? "border-red-500/50" : "border-white/10 focus:border-[#c9a84c]/40"
                }`}
                style={{ backgroundColor: "#0a0d1a" }}
              >
                <option value="">Select age group</option>
                <option value="13-17">13–17 years</option>
                <option value="18-24">18–24 years</option>
                <option value="25-35">25–35 years</option>
                <option value="35+">35+ years</option>
              </select>
              {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
            </div>
            <Field label="Church" value={form.church} onChange={(v) => set("church", v)} error={errors.church} required />
            <Field label="City" value={form.city} onChange={(v) => set("city", v)} error={errors.city} required />
          </div>

          <Field
            label="Questions (optional)"
            value={form.questions || ""}
            onChange={(v) => set("questions", v)}
            type="textarea"
            placeholder="Any questions for the team…"
          />
          <Field
            label="Prayer Requests (optional)"
            value={form.prayer_requests || ""}
            onChange={(v) => set("prayer_requests", v)}
            type="textarea"
            placeholder="Share prayer requests…"
          />

          {/* Attended toggle */}
          <div className="flex items-center justify-between bg-white/4 border border-white/8 rounded-xl px-4 py-3">
            <div>
              <p className="text-white text-sm font-medium">Attended Event</p>
              <p className="text-white/40 text-xs">Mark if this person attended on 15 August</p>
            </div>
            <button
              onClick={() => set("attended", !form.attended)}
              className={`w-12 h-6 rounded-full border transition-all duration-200 relative ${
                form.attended ? "bg-green-500/30 border-green-500/50" : "bg-white/10 border-white/15"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200 ${
                  form.attended ? "left-6 bg-green-400" : "left-0.5 bg-white/40"
                }`}
              />
            </button>
          </div>

          {saveError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-xs">{saveError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-white/5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/10 text-white/60 rounded-xl text-sm hover:border-white/20 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #c9a84c, #d4b55f)", color: "#07090f" }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-[#07090f]/30 border-t-[#07090f] rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({
  reg,
  onClose,
  onDeleted,
}: {
  reg: Registration;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    const { error } = await getSupabase().from("registrations").delete().eq("id", reg.id);
    setDeleting(false);
    if (error) {
      setError(error.message || "Failed to delete.");
      return;
    }
    onDeleted(reg.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#0a0d1a] border border-red-500/20 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Delete Registration?</h3>
          <p className="text-white/50 text-sm mb-2">
            This will permanently remove <span className="text-white font-medium">{reg.name}</span>'s registration.
          </p>
          <p className="text-white/30 text-xs font-mono mb-6">{reg.id}</p>
          {error && (
            <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-white/60 rounded-xl text-sm hover:border-white/20 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-3 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Registrations Tab ─────────────────────────────────────────────────────────

function RegistrationsTab({
  regs,
  setRegs,
  loading,
}: {
  regs: Registration[];
  setRegs: React.Dispatch<React.SetStateAction<Registration[]>>;
  loading: boolean;
}) {
  const [search, setSearch] = useState("");
  const [editReg, setEditReg] = useState<Registration | null>(null);
  const [deleteReg, setDeleteReg] = useState<Registration | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const filtered = regs.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      (r.church || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.city || "").toLowerCase().includes(search.toLowerCase())
  );

  async function toggleAttendance(r: Registration) {
    const { error } = await getSupabase()
      .from("registrations")
      .update({ attended: !r.attended })
      .eq("id", r.id);
    if (!error) setRegs((prev) => prev.map((x) => (x.id === r.id ? { ...x, attended: !r.attended } : x)));
  }

  async function resendEmail(r: Registration) {
    setSendingId(r.id);
    try {
      await getSupabase().functions.invoke("send-ticket", {
        body: {
          email: r.email.trim().toLowerCase(),
          name: r.name,
          registrationId: r.id,
          image: null,
        },
      });
      alert(`Pass email sent to ${r.email}`);
    } catch {
      alert("Failed to send email. Please try again.");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by name, email, ID, church, or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c9a84c]/40 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-white/40 text-xs">
          {filtered.length} of {regs.length} registrations
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">
          {regs.length === 0 ? "No registrations yet." : "No results for your search."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white/3 border border-white/7 rounded-xl p-4 hover:border-white/15 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-white font-semibold text-sm">{r.name}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                        r.attended
                          ? "bg-green-500/15 text-green-400 border-green-500/25"
                          : "bg-white/5 text-white/30 border-white/10"
                      }`}
                    >
                      {r.attended ? "✓ Attended" : "Not Attended"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/40">
                    <span>{r.email}</span>
                    <span>·</span>
                    <span>{r.phone}</span>
                    <span>·</span>
                    <span>{r.church}</span>
                    <span>·</span>
                    <span>{r.city}</span>
                  </div>
                  <p className="text-[#c9a84c] text-xs font-mono mt-1">{r.id}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleAttendance(r)}
                    title={r.attended ? "Mark not attended" : "Mark attended"}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      r.attended
                        ? "bg-green-500/15 text-green-400 border-green-500/25 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/25"
                        : "bg-white/5 text-white/40 border-white/10 hover:bg-green-500/15 hover:text-green-400 hover:border-green-500/25"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 inline mr-1" />
                    {r.attended ? "Attended" : "Mark Present"}
                  </button>
                  <button
                    onClick={() => resendEmail(r)}
                    disabled={sendingId === r.id}
                    title="Resend pass email"
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 hover:bg-[#c9a84c]/20 transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {sendingId === r.id ? "Sending…" : "Email"}
                  </button>
                  <button
                    onClick={() => setEditReg(r)}
                    title="Edit registration"
                    className="px-3 py-1.5 rounded-lg text-xs bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteReg(r)}
                    title="Delete registration"
                    className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {editReg && (
          <EditModal
            reg={editReg}
            onClose={() => setEditReg(null)}
            onSaved={(updated) => {
              setRegs((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
              setEditReg(null);
            }}
          />
        )}
        {deleteReg && (
          <DeleteModal
            reg={deleteReg}
            onClose={() => setDeleteReg(null)}
            onDeleted={(id) => {
              setRegs((prev) => prev.filter((r) => r.id !== id));
              setDeleteReg(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Add Registration Tab ──────────────────────────────────────────────────────

function AddRegistrationTab({ onAdded }: { onAdded: (r: Registration) => void }) {
  const blank = {
    name: "",
    email: "",
    phone: "",
    age: "",
    church: "",
    city: "",
    questions: "",
    prayer_requests: "",
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [success, setSuccess] = useState<Registration | null>(null);

  function set(key: string, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    const ph = form.phone.trim();
    if (!ph) e.phone = "Required";
    else if (!/^\d{10}$/.test(ph)) e.phone = "10 digits only";
    else if (!/^[6-9]\d{9}$/.test(ph)) e.phone = "Must start with 6–9";
    if (!form.age) e.age = "Required";
    if (!form.church.trim()) e.church = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setWarning("");

    // Soft duplicate warnings (admin can override)
    const { data: emailCheck } = await getSupabase()
      .from("registrations")
      .select("id")
      .eq("email", form.email.trim().toLowerCase())
      .maybeSingle();
    if (emailCheck) {
      setWarning(`⚠️ Email ${form.email} is already registered (ID: ${emailCheck.id}). Proceeding will create a duplicate.`);
    }

    const id = generateRegId();
    const { error } = await getSupabase()
      .from("registrations")
      .insert({
        id,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        age: form.age,
        church: form.church.trim(),
        city: form.city.trim(),
        questions: form.questions || null,
        prayer_requests: form.prayer_requests || null,
        attended: false,
      });

    setLoading(false);
    if (error) {
      setErrors({ name: error.message || "Failed to add registration." });
      return;
    }

    const newReg: Registration = {
      id,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      age: form.age,
      church: form.church.trim(),
      city: form.city.trim(),
      questions: form.questions || undefined,
      prayer_requests: form.prayer_requests || undefined,
      attended: false,
      timestamp: new Date().toISOString(),
    };
    setSuccess(newReg);
    onAdded(newReg);
    setForm(blank);
    setWarning("");
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center py-12 space-y-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-white font-bold text-xl">Registration Added!</h3>
        <p className="text-white/50 text-sm">{success.name} has been registered.</p>
        <p className="text-[#c9a84c] font-mono text-lg font-bold">{success.id}</p>
        <button
          onClick={() => setSuccess(null)}
          className="mt-4 px-6 py-3 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-xl text-sm font-semibold hover:bg-[#c9a84c]/20 transition-all flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          Add Another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="bg-[#c9a84c]/8 border border-[#c9a84c]/15 rounded-xl px-4 py-3 flex items-start gap-2">
        <Shield className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
        <p className="text-[#c9a84c]/80 text-xs leading-relaxed">
          Admin manual registration. Duplicate checks are shown as warnings only — you can still proceed.
        </p>
      </div>

      {warning && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-yellow-300 text-xs leading-relaxed">{warning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} error={errors.name} required placeholder="e.g. John Doe" />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" error={errors.email} required placeholder="john@example.com" />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => set("phone", v.replace(/\D/g, "").slice(0, 10))}
          type="tel"
          error={errors.phone}
          required
          placeholder="10-digit number"
        />
        <div>
          <label className="block text-white/50 text-xs font-mono tracking-widest uppercase mb-2">
            Age Group <span className="text-[#c9a84c]">*</span>
          </label>
          <select
            value={form.age}
            onChange={(e) => set("age", e.target.value)}
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-all ${
              errors.age ? "border-red-500/50" : "border-white/10 focus:border-[#c9a84c]/40"
            }`}
            style={{ backgroundColor: "#0a0d1a" }}
          >
            <option value="">Select age group</option>
            <option value="13-17">13–17 years</option>
            <option value="18-24">18–24 years</option>
            <option value="25-35">25–35 years</option>
            <option value="35+">35+ years</option>
          </select>
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
        </div>
        <Field label="Church" value={form.church} onChange={(v) => set("church", v)} error={errors.church} required placeholder="Church name" />
        <Field label="City" value={form.city} onChange={(v) => set("city", v)} error={errors.city} required placeholder="City" />
      </div>

      <Field label="Questions (optional)" value={form.questions} onChange={(v) => set("questions", v)} type="textarea" placeholder="Any questions…" />
      <Field label="Prayer Requests (optional)" value={form.prayer_requests} onChange={(v) => set("prayer_requests", v)} type="textarea" placeholder="Prayer requests…" />

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 flex items-center gap-2"
        style={{ background: "linear-gradient(135deg, #c9a84c, #d4b55f)", color: "#07090f", boxShadow: "0 0 24px rgba(201,168,76,0.2)" }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-[#07090f]/30 border-t-[#07090f] rounded-full animate-spin" />
            Adding…
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add Registration
          </>
        )}
      </button>
    </form>
  );
}

// ─── QR Scanner Tab ────────────────────────────────────────────────────────────

function ScannerTab() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const scannerInstance = useRef<any>(null);
  const [scanResult, setScanResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualId, setManualId] = useState("POY26-");
  const [testMode, setTestMode] = useState(false);

  async function processId(rawId: string) {
    if (processing) return;
    const id = rawId.trim().toUpperCase();
    if (!id || id === "POY26-") return;

    if (!testMode) {
      const now = new Date();
      const eventDay = new Date("2026-08-15T00:00:00+05:30");
      const eventDayEnd = new Date("2026-08-16T00:00:00+05:30");
      if (now < eventDay || now >= eventDayEnd) {
        setScanResult({ ok: false, msg: "🔒 Check-in is only allowed on 15 August 2026." });
        setTimeout(() => setScanResult(null), 5000);
        return;
      }
    }

    setProcessing(true);
    setScanResult(null);
    const { data, error } = await getSupabase()
      .from("registrations")
      .select("id,name,attended")
      .eq("id", id)
      .single();
    if (error || !data) {
      setScanResult({ ok: false, msg: `❌ Not found: ${id}` });
    } else if (data.attended) {
      setScanResult({ ok: false, msg: `⚠️ Already checked in — ${data.name}` });
    } else {
      await getSupabase().from("registrations").update({ attended: true }).eq("id", id);
      setScanResult({ ok: true, msg: `✅ Entry granted — ${data.name}` });
    }
    setProcessing(false);
    setTimeout(() => setScanResult(null), 4000);
  }

  useEffect(() => {
    let mounted = true;
    const initScanner = async () => {
      if (!scannerRef.current) return;
      try {
        const instance = new Html5Qrcode("qr-reader-admin");
        scannerInstance.current = instance;
        await instance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            if (!processing && mounted) processId(decodedText);
          },
          () => {}
        );
      } catch (err: any) {
        if (mounted) setCameraError(err?.message || "Camera not available");
      }
    };
    initScanner();
    return () => {
      mounted = false;
      scannerInstance.current?.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">QR Check-In Scanner</h3>
          <p className="text-white/40 text-xs mt-0.5">Scan QR codes or enter IDs to mark attendance</p>
        </div>
        <button
          onClick={() => setTestMode((v) => !v)}
          className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
            testMode
              ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-400"
              : "bg-white/5 border-white/10 text-white/30 hover:text-white/60"
          }`}
        >
          {testMode ? "🧪 Test Mode ON" : "Test Mode"}
        </button>
      </div>

      {testMode && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5 text-yellow-400/80 text-xs text-center">
          Test mode active — date lock bypassed
        </div>
      )}

      {cameraError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <Camera className="w-8 h-8 text-red-400/50 mx-auto mb-2" />
          <p className="text-red-400 text-sm">{cameraError}</p>
          <p className="text-white/30 text-xs mt-1">Use manual entry below</p>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
          <div id="qr-reader-admin" ref={scannerRef} className="w-full" />
          {processing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-sm text-center py-3 px-4 rounded-xl border font-semibold ${
              scanResult.ok
                ? "bg-green-500/15 border-green-500/25 text-green-400"
                : "bg-red-500/15 border-red-500/25 text-red-400"
            }`}
          >
            {scanResult.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual entry */}
      <div className="border-t border-white/8 pt-4 space-y-2">
        <p className="text-white/40 text-xs text-center font-mono">Manual Entry</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="POY26-XXXXXXXX"
            value={manualId}
            autoCapitalize="characters"
            onChange={(e) => {
              const upper = e.target.value.toUpperCase();
              setManualId(upper.startsWith("POY26-") ? upper : "POY26-");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { processId(manualId); setManualId("POY26-"); }
            }}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c9a84c]/40 transition-all font-mono"
          />
          <button
            onClick={() => { processId(manualId); setManualId("POY26-"); }}
            className="px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, #c9a84c, #d4b55f)", color: "#07090f" }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Token Manager Tab ─────────────────────────────────────────────────────────

function TokensTab() {
  type Token = { id: string; token: string; label: string; active: boolean; created_at: string };
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchTokens() {
    setLoading(true);
    const { data } = await getSupabase()
      .from("scanner_tokens")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (data) setTokens(data as Token[]);
  }

  useEffect(() => { fetchTokens(); }, []);

  async function createToken() {
    if (!newLabel.trim()) return;
    setCreating(true);
    const code = generateScanToken();
    const { error } = await getSupabase()
      .from("scanner_tokens")
      .insert({ token: code, label: newLabel.trim(), active: true });
    if (error) console.error("Create token error:", error);
    setNewLabel("");
    setCreating(false);
    fetchTokens();
  }

  async function toggleToken(id: string, active: boolean) {
    await getSupabase().from("scanner_tokens").update({ active: !active }).eq("id", id);
    fetchTokens();
  }

  async function deleteToken(id: string) {
    await getSupabase().from("scanner_tokens").delete().eq("id", id);
    fetchTokens();
  }

  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h3 className="text-white font-semibold mb-1">Volunteer Scanner Tokens</h3>
        <p className="text-white/40 text-xs">Issue tokens to volunteers so they can access the QR scanner without admin credentials.</p>
      </div>

      {/* Create */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 space-y-3">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Create New Token</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Volunteer name"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createToken()}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:border-[#c9a84c]/40 transition-all"
          />
          <button
            onClick={createToken}
            disabled={creating}
            className="px-4 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, #c9a84c, #d4b55f)", color: "#07090f" }}
          >
            <Key className="w-4 h-4" />
            Generate
          </button>
        </div>
      </div>

      {/* Token list */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin" />
        </div>
      ) : tokens.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-8">No tokens yet</p>
      ) : (
        <div className="space-y-2">
          {tokens.map((t) => (
            <div key={t.id} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white font-mono text-sm font-bold">{t.token}</p>
                <p className="text-white/40 text-xs truncate">{t.label}</p>
              </div>
              <button
                onClick={() => toggleToken(t.id, t.active)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                  t.active
                    ? "bg-green-500/15 border-green-500/25 text-green-400 hover:bg-red-500/15 hover:border-red-500/25 hover:text-red-400"
                    : "bg-white/5 border-white/10 text-white/40 hover:bg-green-500/15 hover:border-green-500/25 hover:text-green-400"
                }`}
              >
                {t.active ? "Active" : "Paused"}
              </button>
              <button
                onClick={() => deleteToken(t.id)}
                className="text-white/20 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-white/15 text-xs font-mono text-center">Share the token code with your volunteer to grant scanner access</p>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

const TAB_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "registrations", label: "Registrations", icon: <Users className="w-4 h-4" /> },
  { id: "add", label: "Add Registration", icon: <Plus className="w-4 h-4" /> },
  { id: "scanner", label: "Check-In Scanner", icon: <QrCode className="w-4 h-4" /> },
  { id: "tokens", label: "Scanner Tokens", icon: <Key className="w-4 h-4" /> },
];

// ─── Dashboard Page ────────────────────────────────────────────────────────────

function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchRegs = async () => {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("registrations")
      .select("*")
      .order("timestamp", { ascending: false });
    setLoading(false);
    if (!error && data) setRegs(data as Registration[]);
  };

  useEffect(() => { fetchRegs(); }, []);

  const activeTab = TAB_ITEMS.find((t) => t.id === tab);

  function handleLogout() {
    sessionStorage.removeItem("poy_admin_auth");
    onLogout();
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #07090f 0%, #0b0e1a 100%)",
        fontFamily: "'Inter', sans-serif",
        color: "white",
      }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3.5 border-b border-white/5 bg-[#07090f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white/60 hover:text-white p-1 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/25 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-[#c9a84c]" />
            </div>
            <span className="font-bold text-sm text-white">POY 2026 Admin</span>
            <span className="hidden sm:inline text-xs text-green-400/70 font-mono ml-1">● LIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-white/30 hover:text-white/60 text-xs transition-colors hidden sm:block"
          >
            ← Main Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar — desktop always visible, mobile overlay */}
        <>
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={`
              fixed md:sticky top-0 md:top-[57px] z-20 h-full md:h-[calc(100vh-57px)]
              w-64 bg-[#080a14] border-r border-white/5 flex flex-col
              transition-transform duration-300 md:translate-x-0 md:flex
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
            style={{ paddingTop: sidebarOpen ? "57px" : undefined }}
          >
            <nav className="flex-1 overflow-y-auto p-3 pt-4 space-y-1">
              {TAB_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    tab === item.id
                      ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="border-t border-white/5 p-4">
              <p className="text-white/15 text-[10px] font-mono text-center">POY 2026 Admin v2.0</p>
            </div>
          </aside>
        </>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[#c9a84c] mb-1">
                {activeTab?.icon}
                <span className="text-xs font-mono tracking-widest uppercase">{activeTab?.label}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {activeTab?.label}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "overview" && (
                  <OverviewTab regs={regs} loading={loading} onRefresh={fetchRegs} />
                )}
                {tab === "registrations" && (
                  <RegistrationsTab regs={regs} setRegs={setRegs} loading={loading} />
                )}
                {tab === "add" && (
                  <AddRegistrationTab
                    onAdded={(r) => setRegs((prev) => [r, ...prev])}
                  />
                )}
                {tab === "scanner" && <ScannerTab />}
                {tab === "tokens" && <TokensTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── AdminPortal Root ──────────────────────────────────────────────────────────

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("poy_admin_auth") === "1";
  });

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <DashboardPage onLogout={() => setIsLoggedIn(false)} />
        </motion.div>
      ) : (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginPage onLogin={() => setIsLoggedIn(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
