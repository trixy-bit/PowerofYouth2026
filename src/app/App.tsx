
import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import { getSupabase } from "@/supabase";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import eventBanner from "@/imports/POY_2026.jpg";
import sammyPhoto from "@/imports/Pas._Sammy.png";
import heroBg from "@/imports/image.png";
import eshithaPhoto from "@/imports/Eshitha.jpg";
import bhanuanna from "@/imports/ABC.png";
import ticketTemplate from "@/imports/ticket_template.png";
import poy1 from "@/imports/POY1.JPG";
import poy2 from "@/imports/POY2.JPG";
import poy3 from "@/imports/POY3.jpg";
import poy4 from "@/imports/POY4.jpg";
import poy5 from "@/imports/POY5.JPG";
import poy6 from "@/imports/POY6.JPG";
import poy7 from "@/imports/POY7.jpg";
import poy8 from "@/imports/POY8.jpg";
import poy9 from "@/imports/POY9.jpg";
import maranathaLogo from "@/imports/Maranatha_logo.jpg";
import poyPosterVertical from "@/imports/POY_poster_vertical.jpg";
import { motion, AnimatePresence } from "motion/react";
import {
  AtSign,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  X,
  Menu,
  Mail,
  Phone,
  Star,
  Users,
  CheckCircle,
  Download,
  QrCode,
  BarChart2,
  LogOut,
  Eye,
  EyeOff,
  Shield,
  Send,
  ChevronRight,
  Play,
  Globe,
  Mic,
  BookOpen,
  ArrowRight,
  Sparkles,
  Heart,
  Cross,
  RefreshCw,
} from "lucide-react";

// ─── Pass Image Generator ─────────────────────────────────────────────────────

const generatePassDataUrl = async (
  element: HTMLDivElement | null,
  id: string,
  details?: { name?: string; church?: string; city?: string }
): Promise<string> => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 1136;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // 0. Fill canvas background with dark tone to prevent WhatsApp transparent white fill
      ctx.fillStyle = "#06090c";
      ctx.fillRect(0, 0, 640, 1136);

      // 1. Draw background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = ticketTemplate;
      await new Promise((resolve) => {
        if (bgImg.complete) return resolve(true);
        bgImg.onload = () => resolve(true);
        bgImg.onerror = () => resolve(false);
      });
      ctx.drawImage(bgImg, 0, 0, 640, 1136);

      // 2. Draw QR code background container & QR code
      const qrBoxX = 320 - 114;
      const qrBoxY = 436 - 14 - 19;
      const qrBoxSize = 228;
      const radius = 20;

      // Draw white background behind QR for scannability
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, radius);
      } else {
        ctx.rect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
      }
      ctx.fill();

      // Draw gold accent border around QR box
      ctx.strokeStyle = "rgba(201, 168, 76, 0.7)";
      ctx.lineWidth = 3;
      ctx.stroke();

      const svgElement = element?.querySelector("svg");
      if (svgElement) {
        let svgString = new XMLSerializer().serializeToString(svgElement);
        // Remove ALL rect elements — the white background is already drawn by canvas above
        // Leaving only the black QR dot paths on the white canvas box
        svgString = svgString.replace(/<rect[^>]*\/?>/gi, "");
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const qrImg = new Image();
        qrImg.src = url;
        await new Promise((resolve) => {
          qrImg.onload = () => resolve(true);
          qrImg.onerror = () => resolve(false);
        });

        ctx.drawImage(qrImg, 320 - 100, 436 - 19, 200, 200);
        URL.revokeObjectURL(url);
      }

      // 3. Draw participant text details
      const name = details?.name || "";
      const church = details?.church || "";
      const city = details?.city || "";

      if (name) {
        const nameLen = name.trim().length;
        const fontSize = nameLen > 22 ? 24 : nameLen > 16 ? 28 : 32;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${fontSize}px 'Inter', sans-serif, Arial`;
        ctx.textAlign = "center";
        ctx.fillText(name.toUpperCase(), 320, 676);
      }

      if (church) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = `600 18px 'Inter', sans-serif, Arial`;
        ctx.textAlign = "center";
        const churchCity = `${church}${city ? ` - ${city}` : ""}`.toUpperCase();
        ctx.fillText(churchCity, 320, 714);
      }

      if (id) {
        ctx.fillStyle = "#e8c56c";
        ctx.font = `bold 24px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(id, 320, 748);
      }

      return canvas.toDataURL("image/png");
    }
  } catch (err) {
    console.warn("Canvas pass rendering fallback...", err);
  }

  // Fallback to toPng
  if (element) {
    try {
      return await toPng(element, { pixelRatio: 2, cacheBust: false, fontEmbedCSS: "", skipFonts: true });
    } catch (e) {
      console.error("toPng fallback failed:", e);
    }
  }
  return "";
};

const savePassAsImage = async (
  element: HTMLDivElement | null,
  id: string,
  details?: { name?: string; church?: string; city?: string }
) => {
  const fileName = `POY2026-Pass-${id || "pass"}.png`;
  try {
    const dataUrl = await generatePassDataUrl(element, id, details);
    if (dataUrl) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return dataUrl;
    }
  } catch (err) {
    console.error("savePassAsImage error:", err);
  }
  alert("Could not download automatically. Please take a screenshot of your pass!");
};

// ─── Types ────────────────────────────────────────────────────────────────────
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
  created_at?: string;
  questions?: string;
  prayer_requests?: string;
}

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT_DATE = new Date("2026-08-15T09:30:00+05:30");

const POPULAR_CITIES = [
  "Vijayawada",
  "Hyderabad",
  "Visakhapatnam (Vizag)",
  "Anakapalli",
  "Guntur",
  "Rajahmundry",
  "Kakinada",
  "Tirupati",
  "Eluru",
  "Nellore",
  "Kurnool",
  "Ongole",
  "Tenali",
  "Kadapa",
  "Anantapur",
  "Warangal",
];

const SPEAKERS = [
  {
    name: "Pas. Bhanu Chand Alluri",
    role: "Youth Evangelist",
    bio: "A passionate evangelist whose anointed ministry has touched thousands of young lives across Andhra Pradesh and Telangana with a message of hope and redemption.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
    localImage: poy9 as unknown as string,
  },

  {
    name: "Rev. Sammy Thangiah",
    role: "Senior Pastor & Revival Preacher",
    bio: "An internationally recognized revivalist with over three decades of ministry, known for his powerful expository preaching and transformative altar calls.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
    localImage: poy8 as unknown as string,
  },
];

const SCHEDULE = [
  {
    time: "09:30 AM",
    title: "Gates Open & Registration",
    desc: "Welcome desk, fellowship, and praise music",
    type: "logistics",
  },
  {
    time: "10:00 AM",
    title: "Opening Worship",
    desc: "Led by Bro. Chandra Mouli and the worship team",
    type: "worship",
  },
  {
    time: "10:45 AM",
    title: "Testimonies",
    desc: "Stories of transformation from young lives",
    type: "special",
  },
  {
    time: "11:30 AM",
    title: "Exhortation",
    desc: "Pas. Bhanu Chand Alluri",
    type: "exhortation",
  },
  {
    time: "12:30 PM",
    title: "Word Session",
    desc: "Rev. Sammy Thangaiah",
    type: "word",
  },
  {
    time: "1:45 PM",
    title: "Prayer & Intercession",
    desc: "prayer for the whole congregation",
    type: "prayer",
  },
];

const PREVIOUS_THEMES = [
  {
    year: "2023",
    theme: "Involve , Introspect , Independence",
    verse: "",
    desc: "A transformative session focused on active involvement, deep introspection, and finding true independence in Christ.",
    color: "from-[#6b8cff] to-[#4f6de6]",
    youtube:
      "https://www.youtube.com/live/paK_jdTF0-U?si=D5hfPB9AuFIr8qxV",
  },
  {
    year: "2024",
    theme: "The Truth will set you free",
    verse: "",
    desc: "An eye-opening gathering exploring the power of truth and the ultimate freedom it brings to our lives.",
    color: "from-[#e8914a] to-[#c96d28]",
    youtube:
      "https://www.youtube.com/live/DtIgy1bWCOo?si=zinIXeaeXcjFiyLc",
  },
  {
    year: "2025",
    theme: "Rooted Deep and Built Up",
    verse: "Col 2:6,7",
    desc: "A foundation-building year centered on deepening our roots in faith and growing stronger together.",
    color: "from-[#6bcf8f] to-[#3ba765]",
    youtube:
      "https://www.youtube.com/live/YgeiYKsXnJY?si=hX-pw723nTxePlsX",
  },
  {
    year: "2026",
    theme: "Your Story Isn't Over",
    verse: "Romans 8:28",
    desc: "Join us this year as we celebrate God's faithfulness and discover that your story isn't over.",
    color: "from-[#c9a84c] to-[#f1d57a]",
    current: true,
  },
];

const FAQ = [
  {
    q: "Is registration free?",
    a: "Yes! Power of Youth 2026 is completely free to attend.",
  },
  {
    q: "Is food provided?",
    a: "Complimentary lunch will be served to all registered attendees.",
  },
  {
    q: "What should I bring?",
    a: "Bring your Bible, a notebook, your QR code pass, and a heart ready to be transformed!",
  },

  {
    q: "Can I come with my church group?",
    a: "Absolutely! Group registrations are encouraged. Each individual must register separately to receive their unique pass and QR code.",
  },
  {
    q: "Will the event be streamed online?",
    a: "The event will be streamed on our YouTube channel. However, we encourage you to join us in person to share in the worship, fellowship, and atmosphere of the gathering.",
  },
];

const GALLERY_IMAGES = [
  { image: poy1, alt: "Stage performance with flag" },
  { image: poy2, alt: "Speaker at pulpit" },
  { image: poy3, alt: "Audience crowd in temple" },
  { image: poy4, alt: "Youth worshipping" },
  { image: poy5, alt: "Youth conference gathering" },
  { image: poy6, alt: "Event stage lights" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function generateRegId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "POY26-";
  for (let i = 0; i < 8; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function useCountdown(target: Date): CountdownValue {
  const [value, setValue] = useState<CountdownValue>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setValue({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setValue({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return value;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="0.5"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13.5 22V13.8H16.3L16.7 10.6H13.5V8.6c0-.93.26-1.56 1.59-1.56H16.8V4.18C16.5 4.14 15.76 4 14.9 4c-2.66 0-4.4 1.62-4.4 4.6v2H7.8v3.2h2.7V22h3z" />
    </svg>
  );
}
function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16.3 10.2c-.2-2.1-1.7-3.6-4.3-3.6-2.8 0-4.7 1.8-4.7 4.5 0 2.5 1.7 4.3 4.4 4.3 1.8 0 3-.8 3.5-2.2.3-.7.3-1.5.1-2.2.8.2 1.4.8 1.4 1.8 0 1.6-1.2 2.8-3.4 2.8-2.7 0-4.8-2-4.8-4.9 0-3.1 2.3-5.3 5.6-5.3 3 0 5 1.8 5.2 4.8h-1zm-4.2 3.4c-1.3 0-2.2-.9-2.2-2.3 0-1.4.9-2.4 2.2-2.4 1.4 0 2.2.9 2.2 2.4 0 1.4-.9 2.3-2.2 2.3z" />
    </svg>
  );
}
function GoldLine() {
  return (
    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto my-4" />
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase font-mono mb-3">
      {children}
    </p>
  );
}

function CountdownBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-white/5 backdrop-blur border border-[#c9a84c]/20 rounded-xl px-4 pt-2 pb-2.5 min-w-[72px] text-center">
          <span className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#c9a84c] tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
      </div>
      <span className="text-[10px] tracking-widest text-white/40 uppercase mt-2 font-mono">
        {label}
      </span>
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar({
  onRegister,
  onRetrieve,
}: {
  onRegister: () => void;
  onRetrieve: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    "About",
    "Speakers",
    "Schedule",
    "Gallery",
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#07090f]/80 border-b border-[#c9a84c]/10"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c9a84c]/40 bg-white flex items-center justify-center">
            <img
              src={maranathaLogo}
              alt="Maranatha Temple Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-sans font-bold text-white text-sm tracking-wide">
            POWER OF YOUTH{" "}
            <span className="text-[#c9a84c]">2026</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-white/60 hover:text-[#c9a84c] text-sm tracking-wide transition-colors"
              onClick={
                l === "Register"
                  ? (e) => {
                      e.preventDefault();
                      onRegister();
                    }
                  : undefined
              }
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://www.youtube.com/@MaranathaTemple"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[#ff0000] transition-colors p-2"
            aria-label="Subscribe on YouTube"
          >
            <YouTubeIcon className="w-4 h-4" />
          </a>
          <a
            href="https://chat.whatsapp.com/Bc7Xjj5RAjW1H1OqyX4F5p?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[#25d366] transition-colors p-2"
            aria-label="Join our WhatsApp community"
          >
            <WhatsAppIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/maranatha_temple"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[#e1306c] transition-colors p-2"
            aria-label="Follow us on Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <a
            href="https://www.facebook.com/share/14i4CWKJJDt/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-[#1877F2] transition-colors p-2"
          >
            {" "}
            <FacebookIcon className="w-4 h-4" />
          </a>

          <a
            href="https://www.threads.net/@yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors p-2"
          >
            <AtSign className="w-4 h-4" />
          </a>

          <div className="flex items-center gap-3">
  <button
    onClick={onRegister}
    className="px-5 py-2 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]"
  >
    Register Now
  </button>

  <button
    onClick={onRetrieve}
    className="px-5 py-2 border border-[#c9a84c] text-[#c9a84c] text-sm font-semibold rounded-full hover:bg-[#c9a84c] hover:text-[#07090f] transition-all duration-200"
  >
    Already Registered?
  </button>
</div>
</div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07090f]/95 backdrop-blur-xl border-b border-[#c9a84c]/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70 hover:text-[#c9a84c] text-base transition-colors py-1"
                >
                  {l}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onRegister();
                }}
                className="mt-2 px-5 py-3 bg-[#c9a84c] text-[#07090f] text-sm font-bold rounded-full"
              >
                Register Now
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onRetrieve();
                }}
                className="px-5 py-3 border border-[#c9a84c] text-[#c9a84c] text-sm font-bold rounded-full hover:bg-[#c9a84c] hover:text-[#07090f] transition-all"
              >
                Already Registered?
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({
  onRegister,
  onRetrieve,
}: {
  onRegister: () => void;
  onRetrieve: () => void;
}) {
  const countdown = useCountdown(EVENT_DATE);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroBg}
          alt="Hourglass and glowing doorway — Power of Youth 2026 backdrop"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090f]/50 via-[#07090f]/20 to-[#07090f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090f]/70 via-transparent to-[#07090f]/70" />
      </div>

      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#c9a84c]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#e8914a]/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#c9a84c] text-xs tracking-[0.15em] uppercase font-mono mb-6">
            Maranatha Temple presents
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-['Playfair_Display'] font-black text-6xl md:text-8xl lg:text-9xl text-white mb-4 leading-none"
        >
          Power of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c9a84c] to-[#e8914a]">
            Youth
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="inline-flex flex-col items-center px-6 py-3 border border-[#c9a84c]/30 rounded-2xl mb-6"
        >
          <span className="font-['Playfair_Display'] italic text-[#c9a84c] text-xl md:text-2xl">
            "Your Story Isn't Over"
          </span>
          <span className="font-['Playfair_Display'] text-[#c9a84c]/80 text-sm mt-1 tracking-wider">
            Romans 8:28
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-white/50 font-mono text-sm mb-6"
        >
          <span className="text-[#c9a84c] font-bold">15 August 2026</span> · 9:30 AM
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex items-center justify-center gap-2 md:gap-3 mb-12"
        >
          <CountdownBlock value={countdown.days} label="Days" />
          <span className="text-[#c9a84c]/50 text-2xl font-light mb-4">
            :
          </span>
          <CountdownBlock
            value={countdown.hours}
            label="Hours"
          />
          <span className="text-[#c9a84c]/50 text-2xl font-light mb-4">
            :
          </span>
          <CountdownBlock
            value={countdown.minutes}
            label="Mins"
          />
          <span className="text-[#c9a84c]/50 text-2xl font-light mb-4">
            :
          </span>
          <CountdownBlock
            value={countdown.seconds}
            label="Secs"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={onRegister}
            className="group px-8 py-4 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] text-sm"
          >
            Register Now — Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onRetrieve}
            className="px-8 py-4 border border-[#c9a84c] text-[#c9a84c] font-bold rounded-full flex items-center gap-2 transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#07090f] text-sm"
          >
            Already Registered?
          </button>
          <a
            href="#schedule"
            className="px-8 py-4 border border-white/20 hover:border-[#c9a84c]/40 text-white/80 hover:text-white font-medium rounded-full flex items-center gap-2 transition-all duration-300 text-sm backdrop-blur"
          >
            <Play className="w-4 h-4" />
            View Schedule
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex items-center justify-center gap-6 text-white/40 text-xs"
        >
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#c9a84c]" />
            Maranatha Temple, Gayatri Nagar, Vijayawada
          </span>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-white/20" />
      </div>
    </section>
  );
}

function EventBanner({
  onRegister,
}: {
  onRegister: () => void;
}) {
  return (
    <section id="banner" className="py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group"
        >
          {/* Glow aura behind the poster */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#c9a84c]/20 via-[#e8914a]/15 to-[#c9a84c]/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-[#c9a84c]/20 shadow-[0_0_60px_rgba(201,168,76,0.12)]">
            <ImageWithFallback
              src={eventBanner}
              alt="Power of Youth 2026 — Your Story Isn't Over. 15 Aug 2026, 9:30 AM. Maranatha Temple, Vijayawada. Featuring Pas. Bhanu Chand Alluri and Rev. Sammy Thangiah."
              className="w-full h-auto object-cover block"
            />

            {/* Subtle bottom overlay with CTA */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07090f]/80 to-transparent flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button
                onClick={onRegister}
                className="px-7 py-2.5 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-full text-sm transition-all duration-200 shadow-[0_0_30px_rgba(201,168,76,0.5)] flex items-center gap-2"
              >
                Register Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Caption strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-1">
            <p className="text-white/30 text-xs font-mono">
              Power of Youth 2026
            </p>
            <p className="text-[#c9a84c]/60 text-xs font-mono">
              Maranatha Temple
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  const features = [
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Anointed Speakers",
      desc: "Two powerful voices delivering Word-centered messages",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Worship Experience",
      desc: "Spirit-filled worship led by gifted musicians",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Youth Community",
      desc: "Connect with 2000+ young believers from across AP & TS",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Scripture Focus",
      desc: "Rooted in Romans 8:28 — all things work together for good",
    },
  ];

  return (
    <section id="about" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel>About the Event</SectionLabel>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-6">
            A Day That Will{" "}
            <span className="text-[#c9a84c]">
              Change Everything
            </span>
          </h2>
          <GoldLine />
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed mt-6">
            Power of Youth 2026 is a one-day spiritual gathering
            designed for young people aged 17-40 who are seeking
            a fresh encounter with God. Whether you are walking
            through pain, confusion, or simply hunger for more —
            this is your day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative flex flex-col md:block bg-[#07090f]/40 md:bg-transparent p-4 md:p-0 rounded-2xl border border-white/5 md:border-none">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={poy7}
                  alt="Youth gathering in prayer"
                  className="w-full h-auto md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090f]/60 to-transparent hidden md:block" />
              </div>
              <div className="mt-4 md:mt-0 md:absolute md:bottom-4 md:left-4 md:right-4">
                <div className="bg-white/10 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
                  <p className="font-['Playfair_Display'] italic text-white text-sm">
                    "And we know that in all things God works
                    for the good of those who love him."
                  </p>
                  <p className="text-[#c9a84c] text-xs mt-1 font-mono">
                    — Romans 8:28
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <Calendar className="w-4 h-4 text-[#c9a84c]" />
              <span>Saturday, 15 August 2026</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <Clock className="w-4 h-4 text-[#c9a84c]" />
              <span>9:30 AM </span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <MapPin className="w-4 h-4 text-[#c9a84c]" />
              <span>
                Maranatha Temple, Gayatri Nagar, Vijayawada, AP
              </span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <Globe className="w-4 h-4 text-[#c9a84c]" />
              <span>Sessions in Telugu & English</span>
            </div>
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <Phone className="w-4 h-4 text-[#c9a84c]" />
              <span>Contact us - 9394247333</span>
            </div>
            <div className="pt-4">
              <p className="text-white/50 text-sm leading-relaxed">
                Organized by Maranatha Visvasa Samajam, this
                annual gathering has been transforming young
                lives since 2006. Each year, hundreds return
                with testimonies of healing, calling, and
                renewed faith. Your story is not written by your
                past — come discover what God has next.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/4 backdrop-blur border border-[#c9a84c]/10 rounded-2xl p-5 hover:border-[#c9a84c]/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 flex items-center justify-center mb-3 text-[#c9a84c] group-hover:bg-[#c9a84c]/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">
                {f.title}
              </h3>
              <p className="text-white/40 text-xs leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Speakers() {
  return (
    <section
      id="speakers"
      className="py-24 md:py-32 px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a84c]/3 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            Voices of{" "}
            <span className="text-[#c9a84c]">Anointing</span>
          </h2>
          <GoldLine />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPEAKERS.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group relative bg-white/4 backdrop-blur border border-[#c9a84c]/10 rounded-3xl overflow-hidden hover:border-[#c9a84c]/30 transition-all duration-500 hover:shadow-[0_0_60px_rgba(201,168,76,0.08)]"
            >
              <div
                className={`relative h-64 overflow-hidden ${s.localImage ? "bg-gradient-to-b from-[#1a2035] to-[#0d1020]" : ""}`}
              >
                <ImageWithFallback
                  src={s.localImage ?? s.image}
                  alt={s.name}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/10 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-0">
                  {s.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  const typeColors: Record<string, string> = {
    worship:
      "bg-purple-500/20 text-purple-300 border-purple-500/30",
    word: "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30",
    exhortation:
      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    logistics:
      "bg-blue-500/20 text-blue-300 border-blue-500/30",
    special:
      "bg-[#e8914a]/20 text-[#e8914a] border-[#e8914a]/30",
    prayer:
      "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };

  const typeLabels: Record<string, string> = {
    worship: "Worship",
    word: "Word",
    exhortation: "Exhortation",
    logistics: "Info",
    special: "Special",
    prayer: "Prayer",
  };

  return (
    <section id="schedule" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel>Event Schedule</SectionLabel>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            15 August 2026
          </h2>
          <GoldLine />
        </motion.div>

        <div className="relative">
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/30 to-transparent" />

          <div className="space-y-6">
            {SCHEDULE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex gap-6 items-start group"
              >
                <div className="w-[64px] shrink-0 text-right">
                  <span className="font-mono text-xs text-white/40 group-hover:text-[#c9a84c] transition-colors leading-tight">
                    {item.time}
                  </span>
                </div>

                <div className="relative flex items-start">
                  <div className="absolute left-[-17px] top-2 w-2.5 h-2.5 rounded-full bg-[#c9a84c]/40 border border-[#c9a84c] group-hover:bg-[#c9a84c] transition-colors" />
                </div>

                <div className="flex-1 bg-white/3 hover:bg-white/6 border border-white/5 hover:border-[#c9a84c]/15 rounded-xl px-5 py-4 transition-all duration-300 ml-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-white/40 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] border font-mono ${typeColors[item.type]}`}
                    >
                      {typeLabels[item.type]}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const topFeatured = GALLERY_IMAGES[0];
  const topRightOne = GALLERY_IMAGES[1];
  const topRightTwo = GALLERY_IMAGES[2];
  const remaining = GALLERY_IMAGES.slice(3);

  return (
    <section id="gallery" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel>Gallery</SectionLabel>
          <h2 className="font-[#Playfair_Display] text-4xl md:text-5xl font-bold text-white mb-4 font-['Playfair_Display']">
            Moments of <span className="text-[#c9a84c]">Glory</span>
          </h2>
          <GoldLine />
          <p className="text-white/40 text-sm mt-4">
            Glimpses from previous years of Power of Youth
          </p>
        </motion.div>

        {/* Top Hero Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
          {/* Main Featured Image (2 Columns wide) */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setSelected(0)}
              className="relative cursor-pointer group overflow-hidden rounded-xl aspect-[16/10] w-full h-full"
            >
              <ImageWithFallback
                src={topFeatured.image}
                alt={topFeatured.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column Stacked Images (1 Column wide) */}
          <div className="flex flex-col gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              onClick={() => setSelected(1)}
              className="relative cursor-pointer group overflow-hidden rounded-xl flex-1 aspect-[16/9.5] md:aspect-auto"
            >
              <ImageWithFallback
                src={topRightOne.image}
                alt={topRightOne.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              onClick={() => setSelected(2)}
              className="relative cursor-pointer group overflow-hidden rounded-xl flex-1 aspect-[16/9.5] md:aspect-auto"
            >
              <ImageWithFallback
                src={topRightTwo.image}
                alt={topRightTwo.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {remaining.map((img, i) => {
            const actualIndex = i + 3;
            return (
              <motion.div
                key={actualIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setSelected(actualIndex)}
                className="relative cursor-pointer group overflow-hidden rounded-xl aspect-[4/3] h-full"
              >
                <ImageWithFallback
                  src={img.image}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-6"
            >
              <button className="absolute top-6 right-6 text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              <ImageWithFallback
                src={GALLERY_IMAGES[selected].image}
                alt={GALLERY_IMAGES[selected].alt}
                className="max-w-full max-h-full rounded-xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PreviousThemes() {
  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c9a84c]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel>Journey Through The Years</SectionLabel>

          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            Previous Year{" "}
            <span className="text-[#c9a84c]">Themes</span>
          </h2>

          <GoldLine />

          <p className="text-white/50 text-lg mt-6 max-w-2xl mx-auto">
            Every year, God gives us a new vision and a new
            message. Here's the journey of Power of Youth
            through the years.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PREVIOUS_THEMES.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              className={`relative rounded-3xl border p-8 text-center backdrop-blur transition-all duration-300 hover:-translate-y-2 ${
                item.current
                  ? "border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_35px_rgba(201,168,76,0.3)]"
                  : "border-white/10 bg-white/5 hover:border-[#c9a84c]/30"
              }`}
            >
              {item.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c9a84c] text-[#07090f] text-[10px] font-bold uppercase tracking-wider">
                  Current Theme
                </div>
              )}

              <div
                className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[#07090f] text-2xl font-black mb-6`}
              >
                {item.year}
              </div>

              <h3 className="font-['Playfair_Display'] text-2xl text-white font-bold mb-3">
                {item.theme}
              </h3>

              <p className="text-[#c9a84c] font-mono tracking-wider text-sm mb-4">
                {item.verse}
              </p>

              <div className="w-12 h-px bg-[#c9a84c]/40 mx-auto mb-4" />

              <p className="text-white/45 text-sm leading-relaxed">
                {item.desc}
              </p>
              {item.youtube && (
                  <a
                    href={item.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#07090f] transition-all duration-300 text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    Watch on YouTube
                  </a>
                )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            FA<span className="text-[#c9a84c]">Q</span>
          </h2>
          <GoldLine />
        </motion.div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white/4 border border-white/8 hover:border-[#c9a84c]/20 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              >
                <span className="text-white/90 font-medium text-sm">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#c9a84c] shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-3">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <SectionLabel>Contact & Location</SectionLabel>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            Find <span className="text-[#c9a84c]">Us</span>
          </h2>
          <GoldLine />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#c9a84c]" />
                  <div>
                    <p className="text-white/80 text-sm">
                      Maranatha Temple
                    </p>
                    <p className="text-white/40 text-xs">
                      Gayatri Nagar, Vijayawada, Andhra Pradesh
                      520003
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#c9a84c]" />
                  <div>
                    <a
                      href="tel:+919394247333"
                      className="text-white/80 text-sm hover:text-[#c9a84c] transition-colors"
                    >
                      +91 93942 47333
                    </a>
                    <p className="text-white/40 text-xs">
                      Prayer Hut
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#c9a84c]" />
                  <div>
                    <a
                      href="mailto:maranathatemple.vja@gmail.com"
                      className="text-white/80 text-sm hover:text-[#c9a84c] transition-colors break-all"
                    >
                      maranathatemple.vja@gmail.com
                    </a>
                    <p className="text-white/40 text-xs">
                      Email response within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-3 text-sm">
                Organized by
              </h3>
              <p className="font-['Playfair_Display'] text-xl text-[#c9a84c] font-bold">
                Maranatha Visvasa Samajam
              </p>
              <p className="text-white/40 text-xs mt-1">
                Vijayawada, Andhra Pradesh
              </p>
              <p className="text-white/40 text-xs mt-3 leading-relaxed">
                Maranatha Visvasa Samajam has been serving the
                Christian community of Andhra Pradesh for over
                44 years, with a heart for revival,
                discipleship, and youth ministry.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-white/8 h-80 lg:h-auto min-h-80 bg-white/4"
          >
            <iframe
              src="https://maps.google.com/maps?q=D.No.59-8-2/1,%20Maranatha%20Temple,%20Gayatri%20Nagar,%20Vijayawada,%20Andhra%20Pradesh%20520008&z=17&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                minHeight: "320px",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maranatha Temple Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Registration Modal ────────────────────────────────────────────────────────

function EventPassCard({
  registrationId,
  name,
  church,
  city,
  cardRef,
}: {
  registrationId: string;
  name: string;
  church: string;
  city: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const nameLength = (name || "").trim().length;
  const nameFontSize =
    nameLength > 22 ? "12px" : nameLength > 16 ? "14px" : "16px";

  return (
    <div
      ref={cardRef as any}
      style={{
        width: "320px",
        height: "568px",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        borderRadius: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Background Template Image */}
      <img
        src={ticketTemplate}
        alt="Ticket Template"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── QR Code — white background for maximum scannability ── */}
      <div
        style={{
          position: "absolute",
          top: "218px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#ffffff",
          border: "2px solid rgba(201, 168, 76, 0.6)",
          padding: "8px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          zIndex: 1,
          boxSizing: "border-box",
        }}
      >
        <QRCode
          value={registrationId}
          size={100}
          style={{ height: "100px", width: "100px", display: "block" }}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      </div>

      {/* ── Name ── */}
      <div
        style={{
          position: "absolute",
          top: "338px",
          width: "100%",
          padding: "0 16px",
          textAlign: "center",
          color: "#ffffff",
          fontSize: nameFontSize,
          fontWeight: "bold",
          letterSpacing: "1px",
          textTransform: "uppercase",
          zIndex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          boxSizing: "border-box",
        }}
      >
        {name}
      </div>

      {/* ── Church / City ── */}
      <div
        style={{
          position: "absolute",
          top: "357px",
          width: "100%",
          padding: "0 16px",
          textAlign: "center",
          color: "rgba(255,255,255,0.6)",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.8px",
          textTransform: "uppercase",
          zIndex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          boxSizing: "border-box",
        }}
      >
        {church}{city ? ` - ${city}` : ""}
      </div>

      {/* ── Registration ID ── */}
      <div
        style={{
          position: "absolute",
          top: "374px",
          width: "100%",
          padding: "0 16px",
          textAlign: "center",
          color: "#e8c56c",
          fontSize: "12px",
          fontFamily: "monospace",
          fontWeight: "bold",
          letterSpacing: "2px",
          zIndex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          boxSizing: "border-box",
        }}
      >
        {registrationId}
      </div>
    </div>
  );
}

type FormStep = "form" | "success";

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  church: string;
  city: string;
  questions?: string;
  prayer_requests?: string;

  agree: boolean;
}

function RegistrationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState<FormStep>("form");
  const [loading, setLoading] = useState(false);
  const [regId, setRegId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const passRef = useRef<HTMLDivElement>(null);

  const downloadPass = async () => {
    await savePassAsImage(passRef.current, regId, {
      name: data.name,
      church: data.church,
      city: data.city,
    });
  };
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    church: "",
    city: "",
    questions: "",
    prayer_requests: "",
    agree: false,
  });
  const [cityOption, setCityOption] = useState<string>("");
  const [customCity, setCustomCity] = useState<string>("");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (step === "success" && regId && data.email) {
      const sendEmailWithRetry = async () => {
        // Wait briefly for the pass element & QR code SVG to mount
        await new Promise((resolve) => setTimeout(resolve, 500));
        let lastErr: unknown;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const dataUrl = await generatePassDataUrl(passRef.current, regId, {
              name: data.name,
              church: data.church,
              city: data.city,
            });
            if (!dataUrl) return;
            const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
            const { error: fnError } = await getSupabase().functions.invoke("send-ticket", {
              body: {
                email: data.email.trim().toLowerCase(),
                name: data.name,
                registrationId: regId,
                image: base64Data,
              },
            });
            if (!fnError) {
              console.log(`✅ Ticket email sent (attempt ${attempt})`);
              return; // success — stop retrying
            }
            lastErr = fnError;
          } catch (err) {
            lastErr = err;
          }
          if (attempt < 3) {
            // Exponential back-off: 2s, 4s
            await new Promise((r) => setTimeout(r, attempt * 2000));
          }
        }
        // All 3 attempts failed — log silently, don't block the user
        console.error("Failed to send ticket email after 3 attempts:", lastErr);
      };
      sendEmailWithRetry();
    }
  }, [step, regId]);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim()) e.name = "Required";
    if (!data.email.includes("@"))
      e.email = "Valid email required";
    
    // Phone validation
    const cleanPhone = data.phone.trim();
    if (!cleanPhone) {
      e.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      e.phone = "Must be a 10-digit phone number";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      e.phone = "Please enter 10 digits only";
    } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      e.phone = "Enter a valid 10-digit mobile number (starts with 6-9)";
    }

    if (!data.age) e.age = "Required";
    if (!data.church.trim()) e.church = "Required";
    if (!data.city.trim()) e.city = "Required";
    if (!data.agree) e.agree = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    setLoading(true);

    // ── Duplicate check: email ──
    const { data: emailCheck } = await getSupabase()
      .from("registrations")
      .select("id")
      .eq("email", data.email.trim().toLowerCase())
      .maybeSingle();
    if (emailCheck) {
      setLoading(false);
      setErrors((prev) => ({ ...prev, email: "This email is already registered. Use 'Already Registered?' to retrieve your pass." }));
      return;
    }

    // ── Duplicate check: phone ──
    const normalize = (p: string) => p.replace(/[\s\-\(\)\+]/g, "").slice(-10);
    const { data: allRegs } = await getSupabase()
      .from("registrations")
      .select("id, phone");
    const phoneDup = (allRegs || []).find(
      (r: any) => normalize(r.phone || "") === normalize(data.phone)
    );
    if (phoneDup) {
      setLoading(false);
      setErrors((prev) => ({ ...prev, phone: "This phone number is already registered. Use 'Already Registered?' to retrieve your pass." }));
      return;
    }

    const id = generateRegId();
    const { error } = await getSupabase()
      .from("registrations")
      .insert({
        id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        church: data.church,
        city: data.city,
        questions: data.questions || null,
        prayer_requests: data.prayer_requests || null,
        attended: false,
      });
    setLoading(false);
    if (error) {
      console.error("Registration DB error:", error);
      // Show a friendly in-form error instead of a raw alert
      const msg =
        error.code === "23505"
          ? "You appear to be already registered. Use \"Already Registered?\" to retrieve your pass."
          : error.message?.includes("network")
          ? "Connection error. Please check your internet and try again."
          : "Registration failed — please try again. If the issue persists, contact the event team.";
      setSubmitError(msg);
      return;
    }
    setRegId(id);
    setStep("success");
  };

  const field = (
    key: keyof FormData,
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <div>
      <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={(data[key] as string) || ""}
          onChange={(e) =>
            setData({ ...data, [key]: e.target.value })
          }
          rows={3}
          className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all resize-none ${
            errors[key]
              ? "border-red-500/50"
              : "border-white/10 focus:border-[#c9a84c]/40"
          }`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={data[key] as string}
          onChange={(e) => {
            if (key === "phone") {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
              setData((prev) => ({ ...prev, phone: cleaned }));
              if (errors.phone) {
                if (/^[6-9]\d{9}$/.test(cleaned) || cleaned.length === 10) {
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }
              }
            } else {
              setData({ ...data, [key]: e.target.value });
            }
          }}
          inputMode={key === "phone" ? "numeric" : undefined}
          pattern={key === "phone" ? "[0-9]*" : undefined}
          maxLength={key === "phone" ? 10 : undefined}
          className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${
            errors[key]
              ? "border-red-500/50"
              : "border-white/10 focus:border-[#c9a84c]/40"
          }`}
        />
      )}
      {errors[key] && (
        <p className="text-red-400 text-xs mt-1">
          {errors[key] as string}
        </p>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0d1020] border border-[#c9a84c]/15 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {step === "form" ? (
          <>
            <div className="relative p-6 pb-4 border-b border-white/5">
              <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 to-transparent" />
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute right-0 top-0 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <SectionLabel>Registration Form</SectionLabel>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-white">
                  Secure Your Seat
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  Power of Youth 2026 · 15 August · Free Entry
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {field(
                "name",
                "Full Name *",
                "text",
                "Your full name",
              )}
              <div className="grid grid-cols-2 gap-3">
                {field(
                  "email",
                  "Email Address *",
                  "email",
                  "you@example.com",
                )}
                {field(
                  "phone",
                  "Phone Number *",
                  "tel",
                  "10-digit number",
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">
                    Age Group *
                  </label>
                  <select
                    value={data.age}
                    onChange={(e) =>
                      setData({ ...data, age: e.target.value })
                    }
                    className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${
                      errors.age
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#c9a84c]/40"
                    }`}
                  >
                    <option value="" className="bg-[#0d1020]">
                      Select age
                    </option>
                    <option
                      value="13-17"
                      className="bg-[#0d1020]"
                    >
                      13–17 years
                    </option>
                    <option
                      value="18-24"
                      className="bg-[#0d1020]"
                    >
                      18–24 years
                    </option>
                    <option
                      value="25-35"
                      className="bg-[#0d1020]"
                    >
                      25–35 years
                    </option>
                    <option
                      value="35+"
                      className="bg-[#0d1020]"
                    >
                      35+ years
                    </option>
                  </select>
                  {errors.age && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.age}
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-white/60 text-xs font-mono tracking-wide">
                      City *
                    </label>
                    {cityOption === "Other" && (
                      <button
                        type="button"
                        onClick={() => {
                          setCityOption("");
                          setCustomCity("");
                          setData((prev) => ({ ...prev, city: "" }));
                        }}
                        className="text-[#c9a84c] hover:text-[#d4b55f] text-[11px] font-mono transition-colors underline"
                      >
                        Select list
                      </button>
                    )}
                  </div>

                  {cityOption === "Other" ? (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter city name..."
                      value={customCity}
                      onChange={(e) => {
                        setCustomCity(e.target.value);
                        setData((prev) => ({ ...prev, city: e.target.value }));
                        if (errors.city) {
                          setErrors((prev) => ({ ...prev, city: undefined }));
                        }
                      }}
                      className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${
                        errors.city
                          ? "border-red-500/50"
                          : "border-white/10 focus:border-[#c9a84c]/40"
                      }`}
                    />
                  ) : (
                    <select
                      value={cityOption}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCityOption(val);
                        if (val !== "Other") {
                          setData((prev) => ({ ...prev, city: val }));
                        } else {
                          setData((prev) => ({ ...prev, city: customCity }));
                        }
                        if (errors.city) {
                          setErrors((prev) => ({ ...prev, city: undefined }));
                        }
                      }}
                      className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${
                        errors.city
                          ? "border-red-500/50"
                          : "border-white/10 focus:border-[#c9a84c]/40"
                      }`}
                    >
                      <option value="" className="bg-[#0d1020]">
                        Select City
                      </option>
                      {POPULAR_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#0d1020]">
                          {c}
                        </option>
                      ))}
                      <option value="Other" className="bg-[#0d1020]">
                        Other (Enter manually)
                      </option>
                    </select>
                  )}
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
              </div>
              {field(
                "church",
                "Church / Organization *",
                "text",
                "Your church name",
              )}

              {field(
                "questions",
                "Any questions you would like to ask? (Optional)",
                "textarea",
                "Type your questions here...",
              )}

              {field(
                "prayer_requests",
                "Prayer Requests (Optional)",
                "textarea",
                "Share your prayer requests with us...",
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={data.agree}
                  onChange={(e) =>
                    setData({
                      ...data,
                      agree: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#c9a84c] mt-0.5"
                />
                <label
                  htmlFor="agree"
                  className="text-white/60 text-xs cursor-pointer leading-relaxed"
                >
                  I agree to the terms and confirm that the
                  information provided is accurate. I consent to
                  receiving event updates via email and
                  WhatsApp.
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-400 text-xs">
                  {errors.agree}
                </p>
              )}

              {/* ── Submit Error Banner ── */}
              {submitError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-lg leading-none mt-0.5">⚠️</span>
                  <div>
                    <p className="text-red-400 text-xs font-semibold mb-0.5">Registration Failed</p>
                    <p className="text-red-400/80 text-xs leading-relaxed">{submitError}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#c9a84c] hover:bg-[#d4b55f] disabled:opacity-60 text-[#07090f] font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#07090f]/30 border-t-[#07090f] rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete Registration
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="p-6 text-center max-h-[85vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <SectionLabel>Registration Confirmed</SectionLabel>
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-white mb-1">
              You&apos;re In, {data.name.split(" ")[0]}!
            </h2>
            <p className="text-white/40 text-xs mb-5">
              Pass is ready. Screenshot or save it below!
            </p>

            <div className="mb-6">
              <EventPassCard
                registrationId={regId}
                name={data.name}
                church={data.church}
                city={data.city}
                cardRef={passRef}
              />
            </div>

            <div className="flex gap-3 max-w-[340px] mx-auto">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-white/10 text-white/70 rounded-xl text-sm hover:border-white/20 transition-colors"
              >
                Close
              </button>
              <button
                onClick={downloadPass}
                className="flex-1 py-3 bg-[#c9a84c] text-[#07090f] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#d4b55f] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Pass
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}


// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ 
  onRegister,
}: { 
  onRegister: () => void;
}) {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c9a84c]/40 bg-white flex items-center justify-center">
                <img
                  src={maranathaLogo}
                  alt="Maranatha Temple Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-['Playfair_Display'] font-bold text-white text-sm">
                Power of Youth 2026
              </span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed">
              An annual youth conference by Maranatha Visvasa
              Samajam, bringing young people face-to-face with
              the transforming power of God.
            </p>
          </div>

          <div>
            <p className="text-white/60 text-xs font-mono tracking-wider uppercase mb-4">
              Quick Links
            </p>
            <div className="space-y-2">
              {[
                "About",
                "Speakers",
                "Schedule",
                "Gallery",
                "FAQ",
                "Contact",
              ].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="block text-white/30 hover:text-[#c9a84c] text-sm transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs font-mono tracking-wider uppercase mb-4">
              The Event
            </p>
            <div className="space-y-2 text-white/30 text-sm">
              <p>15 August 2026, Saturday</p>
              <p>9:30 AM </p>
              <p>Maranatha Temple, Vijayawada</p>
              <p>Free Entry · All Welcome</p>
            </div>
            <button
              onClick={onRegister}
              className="mt-5 px-5 py-2.5 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] text-sm font-bold rounded-full transition-all duration-200 flex items-center gap-2"
            >
              Register Now
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-white/20 text-xs font-mono">
              © 2026 Maranatha Visvasa Samajam. All rights reserved.
            </p>
            <span className="text-white/10 text-xs font-mono">•</span>
            <a
              href="/#/admin"
              className="text-white/10 hover:text-white/30 text-[8px] font-mono transition-colors tracking-widest"
            >
              admin
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <a
              href="https://www.youtube.com/@MaranathaTemple"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/8 hover:border-[#ff0000]/40 hover:bg-[#ff0000]/5 transition-all duration-300"
              aria-label="Subscribe to Maranatha Temple on YouTube"
            >
              <YouTubeIcon className="w-4 h-4 text-white/30 group-hover:text-[#ff0000] transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                YouTube
              </span>
            </a>
            <a
              href="https://chat.whatsapp.com/Bc7Xjj5RAjW1H1OqyX4F5p?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/8 hover:border-[#25d366]/40 hover:bg-[#25d366]/5 transition-all duration-300"
              aria-label="Join Maranatha Temple WhatsApp Community"
            >
              <WhatsAppIcon className="w-4 h-4 text-white/30 group-hover:text-[#25d366] transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                WhatsApp
              </span>
            </a>
            <a
              href="https://www.instagram.com/maranatha_temple"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/8 hover:border-[#e1306c]/40 hover:bg-[#e1306c]/5 transition-all duration-300"
              aria-label="Follow Maranatha Temple on Instagram"
            >
              <InstagramIcon className="w-4 h-4 text-white/30 group-hover:text-[#e1306c] transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                Instagram
              </span>
            </a>
            <a
              href="https://www.facebook.com/share/14i4CWKJJDt/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/8 hover:border-[#1877F2]/40 hover:bg-[#1877F2]/5 transition-all duration-300"
              aria-label="Follow Maranatha Temple on Facebook"
            >
              <FacebookIcon className="w-4 h-4 text-white/30 group-hover:text-[#1877F2] transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                Facebook
              </span>
            </a>
            <a
              href="https://www.threads.net/@yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/8 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              aria-label="Follow us on Threads"
            >
              <AtSign className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                Threads
              </span>
            </a>
          </div>

          <p className="font-['Playfair_Display'] italic text-white/15 text-sm">
            "Your Story Isn't Over" — Romans 8:28
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showRetrieve, setShowRetrieve] = useState(false);

  // Lock scroll when register modal open
  useEffect(() => {
    document.body.style.overflow = showRegister ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showRegister]);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar
        onRegister={() => setShowRegister(true)}
        onRetrieve={() => setShowRetrieve(true)}
      />

      <main>
        <Hero
          onRegister={() => setShowRegister(true)}
          onRetrieve={() => setShowRetrieve(true)}
        />
        <EventBanner onRegister={() => setShowRegister(true)} />
        <About />
        <Speakers />
        <Schedule />
        <Gallery />
        <PreviousThemes />
        <FAQSection />
        <Contact />
      </main>

      <Footer 
        onRegister={() => setShowRegister(true)} 
      />

      {/* Register CTA ribbon */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-max max-w-[92vw]"
      >
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-full shadow-[0_8px_40px_rgba(201,168,76,0.4)] transition-all duration-300 hover:shadow-[0_8px_60px_rgba(201,168,76,0.6)] text-xs md:text-sm whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
          <span>Register Now — 15 August 2026</span>
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
        </button>
      </motion.div>

      <AnimatePresence>
        {showRegister && (
          <RegistrationModal
            onClose={() => setShowRegister(false)}
          />
        )}
        {showRetrieve && (
          <RetrieveModal
            onClose={() => setShowRetrieve(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
function RetrieveModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"lookup" | "otp" | "pass" | "edit">("lookup");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const passRef = useRef<HTMLDivElement>(null);

  // Edit form state
  const [editData, setEditData] = useState<Partial<Registration>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<string, string>>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const sendOtp = async () => {
    setMessage("");
    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid registered email.");
      return;
    }
    setLoading(true);

    // Verify email exists in database first
    const { data: checkData, error: checkError } = await getSupabase()
      .from("registrations")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (checkError || !checkData) {
      setLoading(false);
      setMessage("No registration found with this email.");
      return;
    }

    // Call Supabase Edge Function to send OTP via Zoho
    const { data, error } = await getSupabase().functions.invoke("send-otp", {
      body: { email: email.trim().toLowerCase() }
    });
    setLoading(false);

    if (error || (data && data.error)) {
      setMessage(error?.message || data?.error || "Failed to send OTP. Please try again.");
      return;
    }

    setStep("otp");
  };

  const verifyOtp = async () => {
    setMessage("");
    if (!otp.trim() || otp.length !== 6) {
      setMessage("Please enter a 6-digit OTP code.");
      return;
    }
    setLoading(true);

    // Call Supabase Edge Function to verify OTP
    const { data, error } = await getSupabase().functions.invoke("verify-otp", {
      body: { email: email.trim().toLowerCase(), otp: otp.trim() }
    });
    setLoading(false);

    if (error || (data && data.error) || (data && data.success === false)) {
      const serverErr = data?.error;
      if (serverErr) {
        setMessage(serverErr);
      } else {
        setMessage("Wrong OTP entered. Please try again.");
      }
      return;
    }

    if (data && data.success && data.registration) {
      setRegistration(data.registration as Registration);
      setStep("pass");
    } else {
      setMessage("Verification failed. Please try again.");
    }
  };

  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const sendPassEmail = async (regObj = registration) => {
    if (!regObj) return;
    try {
      setEmailStatus("sending");
      await new Promise((resolve) => setTimeout(resolve, 500));
      const dataUrl = await generatePassDataUrl(passRef.current, regObj.id, {
        name: regObj.name,
        church: regObj.church,
        city: regObj.city,
      });
      if (!dataUrl) {
        setEmailStatus("error");
        return;
      }
      const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      const { error } = await getSupabase().functions.invoke("send-ticket", {
        body: {
          email: regObj.email.trim().toLowerCase(),
          name: regObj.name,
          registrationId: regObj.id,
          image: base64Data,
        },
      });
      if (!error) {
        setEmailStatus("sent");
      } else {
        setEmailStatus("error");
      }
    } catch (err) {
      console.error("Error sending pass email:", err);
      setEmailStatus("error");
    }
  };

  useEffect(() => {
    if (step === "pass" && registration) {
      sendPassEmail(registration);
    }
  }, [step, registration]);

  const downloadPass = async () => {
    if (!registration) return;
    try {
      setLoading(true);
      await savePassAsImage(passRef.current, registration.id, {
        name: registration.name,
        church: registration.church,
        city: registration.city,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0d1020] border border-[#c9a84c]/20 rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div>
              <SectionLabel>Ticket Retrieval</SectionLabel>
              <h2 className="font-['Playfair_Display'] text-xl font-bold text-white">
                {step === "lookup" ? "Retrieve Your Pass" : step === "otp" ? "Verify OTP" : step === "edit" ? "Edit Your Response" : "Your Event Pass"}
              </h2>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === "lookup" ? (
            <div className="space-y-4">
              <p className="text-white/50 text-xs">
                Enter your registered email address. We will send a verification code (OTP) to your email to verify your identity.
              </p>

              <div>
                <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendOtp()}
                  className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all border-white/10 focus:border-[#c9a84c]/40"
                />
              </div>

              {message && (
                <p className="text-red-400 text-xs mt-1">
                  ⚠️ {message}
                </p>
              )}

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3.5 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-4 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
              >
                {loading ? "Sending OTP..." : "Send Verification OTP"}
              </button>
            </div>
          ) : step === "otp" ? (
            <div className="space-y-4">
              <p className="text-white/50 text-xs">
                We've sent a 6-digit verification code to <strong className="text-white">{email}</strong>. Please enter the OTP below.
              </p>

              <div>
                <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder=""
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={e => e.key === "Enter" && verifyOtp()}
                  className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg font-mono font-bold tracking-widest placeholder:text-white/25 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all border-white/10 focus:border-[#c9a84c]/40"
                />
              </div>

              {message && (
                <p className="text-red-400 text-xs mt-1">
                  ⚠️ {message}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setStep("lookup"); setOtp(""); setMessage(""); }}
                  className="flex-1 py-3 border border-white/10 text-white/70 rounded-xl text-sm hover:border-white/20 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#c9a84c] text-[#07090f] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#d4b55f] transition-colors"
                >
                  {loading ? "Verifying..." : "Verify & Get Pass"}
                </button>
              </div>
            </div>
          ) : step === "pass" ? (
            registration ? (
              <div className="space-y-6 text-center">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-white/60 text-xs -mt-4">
                  Registration found for {registration.name}!
                </p>

                <div>
                  <EventPassCard
                    registrationId={registration.id}
                    name={registration.name}
                    church={registration.church}
                    city={registration.city}
                    cardRef={passRef}
                  />
                </div>

                {/* Email Delivery Status & Resend Button */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs max-w-[340px] mx-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white/70 overflow-hidden">
                    <Mail className="w-4 h-4 text-[#c9a84c] shrink-0" />
                    <span className="truncate">
                      {emailStatus === "sending"
                        ? "Sending pass to email..."
                        : emailStatus === "sent"
                        ? "Pass emailed successfully!"
                        : emailStatus === "error"
                        ? "Failed to email pass"
                        : `Pass ready for ${registration.email}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendPassEmail(registration)}
                    disabled={emailStatus === "sending"}
                    className="px-2.5 py-1 text-[11px] bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 rounded-lg font-semibold hover:bg-[#c9a84c]/30 transition-colors shrink-0 disabled:opacity-50"
                  >
                    {emailStatus === "sending" ? "Sending..." : "Resend"}
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-w-[340px] mx-auto">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep("lookup"); setRegistration(null); setOtp(""); setEmailStatus("idle"); }}
                      className="flex-1 py-3 border border-white/10 text-white/70 rounded-xl text-sm hover:border-white/20 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={downloadPass}
                      disabled={loading}
                      className="flex-1 py-3 bg-[#c9a84c] text-[#07090f] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#d4b55f] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Pass
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditData({
                        name: registration.name,
                        phone: registration.phone,
                        age: registration.age,
                        church: registration.church,
                        city: registration.city,
                        questions: registration.questions || "",
                        prayer_requests: registration.prayer_requests || "",
                      });
                      setEditErrors({});
                      setEditSuccess(false);
                      setStep("edit");
                    }}
                    className="w-full py-3 border border-[#c9a84c]/40 text-[#c9a84c] rounded-xl text-sm font-semibold hover:bg-[#c9a84c]/10 transition-colors flex items-center justify-center gap-2"
                  >
                    âœï¸ Edit Your Response
                  </button>
                </div>
              </div>
            ) : null
          ) : step === "edit" && registration ? (
            <div className="space-y-4">
              <p className="text-white/50 text-xs">
                Update your registration details below. Your name and email cannot be changed.
              </p>

              {/* Read-only fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Full Name</label>
                  <div className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-white/40 text-sm">{registration.name}</div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Email</label>
                  <div className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-white/40 text-sm truncate">{registration.email}</div>
                </div>
              </div>

              {/* Editable: Phone */}
              <div>
                <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={editData.phone || ""}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={e => {
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setEditData(prev => ({ ...prev, phone: cleaned }));
                    if (editErrors.phone && /^[6-9]\d{9}$/.test(cleaned)) setEditErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${editErrors.phone ? "border-red-500/50" : "border-white/10 focus:border-[#c9a84c]/40"}`}
                />
                {editErrors.phone && <p className="text-red-400 text-xs mt-1">{editErrors.phone}</p>}
              </div>

              {/* Editable: Age Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Age Group</label>
                  <select
                    value={editData.age || ""}
                    onChange={e => setEditData(prev => ({ ...prev, age: e.target.value }))}
                    className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${editErrors.age ? "border-red-500/50" : "border-white/10 focus:border-[#c9a84c]/40"}`}
                  >
                    <option value="" className="bg-[#0d1020]">Select age</option>
                    <option value="13-17" className="bg-[#0d1020]">13–17 years</option>
                    <option value="18-24" className="bg-[#0d1020]">18–24 years</option>
                    <option value="25-35" className="bg-[#0d1020]">25–35 years</option>
                    <option value="35+" className="bg-[#0d1020]">35+ years</option>
                  </select>
                  {editErrors.age && <p className="text-red-400 text-xs mt-1">{editErrors.age}</p>}
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">City</label>
                  <input
                    type="text"
                    placeholder="Your city"
                    value={editData.city || ""}
                    onChange={e => setEditData(prev => ({ ...prev, city: e.target.value }))}
                    className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${editErrors.city ? "border-red-500/50" : "border-white/10 focus:border-[#c9a84c]/40"}`}
                  />
                  {editErrors.city && <p className="text-red-400 text-xs mt-1">{editErrors.city}</p>}
                </div>
              </div>

              {/* Editable: Church */}
              <div>
                <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Church</label>
                <input
                  type="text"
                  placeholder="Your church name"
                  value={editData.church || ""}
                  onChange={e => setEditData(prev => ({ ...prev, church: e.target.value }))}
                  className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${editErrors.church ? "border-red-500/50" : "border-white/10 focus:border-[#c9a84c]/40"}`}
                />
                {editErrors.church && <p className="text-red-400 text-xs mt-1">{editErrors.church}</p>}
              </div>

              {/* Optional: Questions & Prayer Requests */}
              <div>
                <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Questions (optional)</label>
                <textarea
                  placeholder="Any questions you have..."
                  value={editData.questions || ""}
                  onChange={e => setEditData(prev => ({ ...prev, questions: e.target.value }))}
                  rows={2}
                  className="w-full bg-white/6 border border-white/10 focus:border-[#c9a84c]/40 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1.5 font-mono tracking-wide">Prayer Requests (optional)</label>
                <textarea
                  placeholder="Share your prayer requests..."
                  value={editData.prayer_requests || ""}
                  onChange={e => setEditData(prev => ({ ...prev, prayer_requests: e.target.value }))}
                  rows={2}
                  className="w-full bg-white/6 border border-white/10 focus:border-[#c9a84c]/40 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all resize-none"
                />
              </div>

              {editSuccess && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <p className="text-green-400 text-xs">Your response has been updated successfully!</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("pass"); setEditSuccess(false); }}
                  className="flex-1 py-3 border border-white/10 text-white/70 rounded-xl text-sm hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={editSaving}
                  onClick={async () => {
                    // Validate
                    const errs: Record<string, string> = {};
                    const ph = (editData.phone || "").trim();
                    if (!ph) errs.phone = "Phone number is required";
                    else if (ph.length < 10) errs.phone = "Must be 10 digits";
                    else if (!/^[6-9]\d{9}$/.test(ph)) errs.phone = "Enter a valid mobile number starting with 6-9";
                    if (!editData.age) errs.age = "Required";
                    if (!(editData.church || "").trim()) errs.church = "Required";
                    if (!(editData.city || "").trim()) errs.city = "Required";
                    if (Object.keys(errs).length) { setEditErrors(errs); return; }

                    setEditSaving(true);
                    const { error } = await getSupabase()
                      .from("registrations")
                      .update({
                        phone: editData.phone,
                        age: editData.age,
                        church: editData.church,
                        city: editData.city,
                        questions: editData.questions || null,
                        prayer_requests: editData.prayer_requests || null,
                      })
                      .eq("id", registration.id);
                    setEditSaving(false);
                    if (error) {
                      setEditErrors({ city: "Failed to save. Please try again." });
                      return;
                    }
                    // Update local state
                    setRegistration(prev => prev ? { ...prev, ...editData as Registration } : prev);
                    setEditSuccess(true);
                  }}
                  className="flex-1 py-3 bg-[#c9a84c] text-[#07090f] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#d4b55f] transition-colors disabled:opacity-60"
                >
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AdminLoginModal({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onLogin,
  onClose,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string;
  onLogin: () => void;
  onClose: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0d1020] border border-[#c9a84c]/20 rounded-3xl w-full max-w-sm overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 to-transparent pointer-events-none" />
        
        <div className="p-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mb-4 border border-[#c9a84c]/25">
            <Shield className="w-6 h-6 text-[#c9a84c]" />
          </div>
          
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-1">
            Admin Portal
          </h2>
          <p className="text-white/40 text-xs mb-6">
            Sign in with your administrator credentials.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4 mb-6">
            <div>
              <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#c9a84c]/50 focus:outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-semibold mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#c9a84c]/50 focus:outline-none transition-colors text-sm"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center mt-2 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-white/10 text-white/70 rounded-xl text-sm hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
