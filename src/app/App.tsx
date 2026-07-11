
import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/supabase";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import eventBanner from "@/imports/POY_2026.jpg";
import sammyPhoto from "@/imports/Pas._Sammy.png";
import heroBg from "@/imports/image.png";
import eshithaPhoto from "@/imports/Eshitha.jpg";
import bhanuanna from "@/imports/ABC.png";
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
} from "lucide-react";

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
}

interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT_DATE = new Date("2026-08-15T09:30:00+05:30");

const SPEAKERS = [
  {
    name: "Bhanu Chand Alluri",
    role: "Youth Evangelist & Worship Leader",
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
    title: "Youth Panel Discussion",
    desc: "Stories of transformation from young leaders",
    type: "special",
  },
  {
    time: "11:30 PM",
    title: "Word Session I",
    desc: "Bhanu Chand Alluri",
    type: "word",
  },
  {
    time: "12:30 PM",
    title: "Word Session II",
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
    color: "from-[#6b8cff] to-[#4f6de6]",
    youtube:
      "https://www.youtube.com/live/paK_jdTF0-U?si=D5hfPB9AuFIr8qxV",
  },
  {
    year: "2024",
    theme: "The Truth will set you free",
    verse: "",
    color: "from-[#e8914a] to-[#c96d28]",
    youtube:
      "https://www.youtube.com/live/DtIgy1bWCOo?si=zinIXeaeXcjFiyLc",
  },
  {
    year: "2025",
    theme: "Rooted Deep and Built Up",
    verse: "Col 2:6,7",
    color: "from-[#6bcf8f] to-[#3ba765]",
    youtube:
      "https://www.youtube.com/live/YgeiYKsXnJY?si=hX-pw723nTxePlsX",
  },
  {
    year: "2026",
    theme: "Your Story Isn't Over",
    verse: "Romans 8:28",
    color: "from-[#c9a84c] to-[#f1d57a]",
    current: true,
  },
];

const FAQ = [
  {
    q: "Is registration free?",
    a: "Yes! Power of Youth 2026 is completely free to attend. We believe no young person should be hindered from encountering God due to financial constraints.",
  },
  {
    q: "Is food provided?",
    a: "Complimentary lunch will be served to all registered attendees. Please mention any dietary requirements during registration.",
  },
  {
    q: "What should I bring?",
    a: "Bring your Bible, a notebook, your QR code pass, and a heart ready to be transformed! Dress modestly — smart casual is recommended.",
  },

  {
    q: "Can I come with my church group?",
    a: "Absolutely! Group registrations are encouraged. Each individual must register separately to receive their unique pass and QR code.",
  },
  {
    q: "Will the event be streamed online?",
    a: "Select sessions will be streamed on our YouTube channel. However, we strongly encourage physical attendance for the full experience.",
  },
];

const GALLERY_IMAGES = [
  {
    image: poy1,
    alt: "Crowd worshipping at youth conference",
  },
  { image: poy2 },
  {
    image: poy3,
  },
  {
    image: poy4,
  },
  {
    image: poy5,
  },
  {
    image: poy6,
  },
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
        <div className="bg-white/5 backdrop-blur border border-[#c9a84c]/20 rounded-xl px-4 py-3 min-w-[72px] text-center">
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
    "Register",
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c9a84c]/40 bg-white flex items-center justify-center">
            <img
              src={maranathaLogo}
              alt="Maranatha Temple Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-['Playfair_Display'] font-bold text-white text-sm tracking-wide">
            Power of Youth{" "}
            <span className="text-[#c9a84c]">2026</span>
          </span>
        </div>

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
    Register Free
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
                Register Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onRegister }: { onRegister: () => void }) {
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
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-mono mb-6">
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
          className="inline-block px-5 py-2 border border-[#c9a84c]/30 rounded-full mb-6"
        >
          <span className="font-['Playfair_Display'] italic text-[#c9a84c] text-xl md:text-2xl">
            "Your Story Isn't Over"
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-white/50 font-mono text-sm mb-10"
        >
          Romans 8:28 · 15 August 2026 · 9:30 AM
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
          <span className="hidden sm:flex items-center gap-1.5">
            <Users className="w-3 h-3 text-[#c9a84c]" />·
            Register Early
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
              alt="Power of Youth 2026 — Your Story Isn't Over. 15 Aug 2026, 9:30 AM. Maranatha Temple, Vijayawada. Featuring Bhanu Chand Alluri and Rev. Sammy Thangiah."
              className="w-full h-auto object-cover block"
            />

            {/* Subtle bottom overlay with CTA */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07090f]/80 to-transparent flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button
                onClick={onRegister}
                className="px-7 py-2.5 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-full text-sm transition-all duration-200 shadow-[0_0_30px_rgba(201,168,76,0.5)] flex items-center gap-2"
              >
                Register Free
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
            <div className="relative">
              <img
                src={poy7}
                alt="Youth gathering in prayer"
                className="rounded-2xl w-full object-cover h-72 md:h-80"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#07090f]/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
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
                  className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
                    s.localImage
                      ? "object-contain object-bottom"
                      : "object-cover object-top"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/10 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-1">
                  {s.name}
                </h3>
                <p className="text-[#c9a84c] text-xs font-mono tracking-wider mb-4">
                  {s.role}
                </p>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {s.bio}
                </p>
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
    logistics:
      "bg-blue-500/20 text-blue-300 border-blue-500/30",
    special:
      "bg-[#e8914a]/20 text-[#e8914a] border-[#e8914a]/30",
  };

  const typeLabels: Record<string, string> = {
    worship: "Worship",
    word: "Word",
    logistics: "Info",
    special: "Special",
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
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            Moments of{" "}
            <span className="text-[#c9a84c]">Glory</span>
          </h2>
          <GoldLine />
          <p className="text-white/40 text-sm mt-4">
            Glimpses from previous years of Power of Youth
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setSelected(i)}
              className={`relative cursor-pointer group overflow-hidden rounded-xl ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ aspectRatio: i === 0 ? "16/9" : "4/3" }}
            >
              <ImageWithFallback
                src={
                  img.image ??
                  `https://images.unsplash.com/photo-${img.id}?w=${i === 0 ? 800 : 400}&h=${i === 0 ? 450 : 300}&fit=crop&auto=format`
                }
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
          ))}
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
                src={
                  GALLERY_IMAGES[selected].image ??
                  `https://images.unsplash.com/photo-${GALLERY_IMAGES[selected].id}?w=1200&h=800&fit=crop&auto=format`
                }
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
                {item.current
                  ? "Join us this year as we celebrate God's faithfulness and discover that your story isn't over."
                  : "A powerful theme that inspired and transformed hundreds of young lives."}
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
              </p>
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
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            Common{" "}
            <span className="text-[#c9a84c]">Questions</span>
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
                    <p className="text-white/80 text-sm">
                      +91 93942 47333
                    </p>
                    <p className="text-white/40 text-xs">
                      Prayer Hut
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#c9a84c]" />
                  <div>
                    <p className="text-white/80 text-sm">
                      maranathatemple.vja@gmail.com
                    </p>
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

type FormStep = "form" | "success";

interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  church: string;
  city: string;

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
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    church: "",
    city: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim()) e.name = "Required";
    if (!data.email.includes("@"))
      e.email = "Valid email required";
    if (data.phone.length < 10)
      e.phone = "Valid phone required";
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
    setLoading(true);
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

        attended: false,
      });
    setLoading(false);
    if (error) {
      console.error(error);

      alert(JSON.stringify(error, null, 2));

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
      <input
        type={type}
        placeholder={placeholder}
        value={data[key] as string}
        onChange={(e) =>
          setData({ ...data, [key]: e.target.value })
        }
        className={`w-full bg-white/6 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all ${
          errors[key]
            ? "border-red-500/50"
            : "border-white/10 focus:border-[#c9a84c]/40"
        }`}
      />
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
                  "+91 98765 43210",
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
                {field("city", "City *", "text", "Vijayawada")}
              </div>
              {field(
                "church",
                "Church / Organization *",
                "text",
                "Your church name",
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
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#c9a84c]" />
            </div>
            <SectionLabel>Registration Confirmed</SectionLabel>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-white mb-2">
              You&apos;re In, {data.name.split(" ")[0]}!
            </h2>
            <p className="text-white/50 text-sm mb-6">
              A confirmation has been sent to {data.email}
            </p>
            

            <div className="bg-white/5 border border-[#c9a84c]/20 rounded-2xl p-6 mb-6">
              <p className="text-[#c9a84c] text-xs font-mono mb-3 tracking-wider">
                YOUR REGISTRATION ID
              </p>
              <p className="font-mono text-2xl font-bold text-white tracking-wider mb-4">
                {regId}
              </p>
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-xl p-3">
                  <QRCode
                    value={regId}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>
              </div>
              <p className="text-white/40 text-xs">
                Screenshot or download this QR code to use at
                the venue gate
              </p>
            </div>

            <div className="bg-[#c9a84c]/5 border border-[#c9a84c]/10 rounded-xl p-4 text-left mb-6">
              <p className="text-[#c9a84c] font-semibold text-sm mb-2">
                Event Details
              </p>
              <div className="space-y-1 text-xs text-white/50">
                <p>📅 15 August 2026, Saturday</p>
                <p>🕘 9:30 AM </p>
                <p>
                  📍 Maranatha Temple, Gayatri Nagar, Vijayawada
                </p>
                <p>🎟️ Bring this QR code for entry</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-white/10 text-white/70 rounded-xl text-sm hover:border-white/20 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#c9a84c] text-[#07090f] font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#d4b55f] transition-colors"
              >
                <Download className="w-4 h-4" />
                Save Pass
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<
    "overview" | "registrations" | "scan"
  >("overview");
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchRegs();
  }, []);
  const fetchRegs = async () => {
    const { data, error } = await getSupabase()
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRegs(data as Registration[]);
  };

  const toggleAttendance = async (
    id: string,
    current: boolean,
  ) => {
    const { error } = await getSupabase()
      .from("registrations")
      .update({ attended: !current })
      .eq("id", id);
    if (!error) {
      setRegs((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, attended: !current } : r,
        ),
      );
    }
  };

  const handleScan = async () => {
    const scannedId = scanInput.trim().toUpperCase();
    const { data, error } = await getSupabase()
      .from("registrations")
      .select("*")
      .eq("id", scannedId)
      .single();
    if (error || !data) {
      setScanResult("❌ Registration ID not found");
    } else if (data.attended) {
      setScanResult(`⚠️ Already Checked In — ${data.name}`);
    } else {
      await getSupabase()
        .from("registrations")
        .update({ attended: true })
        .eq("id", scannedId);
      setRegs((prev) =>
        prev.map((r) =>
          r.id === scannedId ? { ...r, attended: true } : r,
        ),
      );
      setScanResult(`✅ Entry granted for ${data.name}`);
    }
    setScanInput("");
    setTimeout(() => setScanResult(null), 4000);
  };

  const filtered = regs.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: regs.length,
    attended: regs.filter((r) => r.attended).length,
    cities: [...new Set(regs.map((r) => r.city))].length,
    today: regs.filter((r) =>
      r.created_at?.startsWith(
        new Date().toISOString().split("T")[0],
      ),
    ).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#0a0d1a] border border-[#c9a84c]/15 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-white font-semibold text-sm">
              Admin Dashboard
            </span>
            {authed && (
              <span className="text-xs text-green-400/70 font-mono ml-2">
                ● LIVE
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex-1 overflow-y-auto p-6">
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Registered",
                      value: stats.total,
                      icon: <Users className="w-4 h-4" />,
                    },
                    {
                      label: "Attended",
                      value: stats.attended,
                      icon: <CheckCircle className="w-4 h-4" />,
                    },
                    {
                      label: "Cities",
                      value: stats.cities,
                      icon: <MapPin className="w-4 h-4" />,
                    },
                    {
                      label: "Today",
                      value: stats.today,
                      icon: <Sparkles className="w-4 h-4" />,
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white/4 border border-white/8 rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-2 text-[#c9a84c] mb-2">
                        {s.icon}
                      </div>
                      <p className="text-3xl font-bold text-white font-['Playfair_Display']">
                        {s.value}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold text-sm">
                      Attendance Rate
                    </h4>
                    <span className="text-[#c9a84c] font-mono text-sm">
                      {stats.total
                        ? Math.round(
                            (stats.attended / stats.total) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#c9a84c] to-[#e8914a] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.total ? (stats.attended / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const csv = [
                        "ID,Name,Email,Phone,Age,Church,City,Attended,Date",
                        ...regs.map(
                          (r) =>
                            `${r.id},${r.name},${r.email},${r.phone},${r.age},${r.church},${r.city},${r.attended},${r.created_at}`,
                        ),
                      ].join("\n");
                      const a = document.createElement("a");
                      a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
                      a.download = "poy2026_registrations.csv";
                      a.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] rounded-xl text-xs hover:bg-[#c9a84c]/20 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={async () => {
                      await getSupabase()
                        .from("registrations")
                        .delete()
                        .neq("id", "");
                      setRegs([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs hover:bg-red-500/20 transition-colors"
                  >
                    Clear Test Data
                  </button>
                </div>
              </div>
            )}

            {tab === "registrations" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50"
                />

                {filtered.length === 0 ? (
                  <div className="text-center py-12 text-white/30 text-sm">
                    {regs.length === 0
                      ? "No registrations yet — register using the main form!"
                      : "No results found"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filtered.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white/4 border border-white/8 rounded-xl p-4 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-white font-medium text-sm">
                            {r.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {r.email} · {r.church}
                          </p>
                          <p className="text-[#c9a84c] text-xs font-mono mt-0.5">
                            {r.id}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            toggleAttendance(r.id, r.attended)
                          }
                          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                            r.attended
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-white/10 text-white/40 border border-white/10 hover:border-[#c9a84c]/30"
                          }`}
                        >
                          {r.attended
                            ? "✓ Attended"
                            : "Mark Present"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "scan" && (
              <div className="max-w-sm mx-auto text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto">
                  <QrCode className="w-10 h-10 text-[#c9a84c]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    QR Code Scanner
                  </h3>
                  <p className="text-white/40 text-sm">
                    Enter or paste a registration ID to mark
                    attendance
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. POY26-ABC12345"
                    value={scanInput}
                    onChange={(e) =>
                      setScanInput(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleScan()
                    }
                    className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none focus:ring-1 focus:ring-[#c9a84c]/50 font-mono"
                  />
                  <button
                    onClick={handleScan}
                    className="px-4 py-3 bg-[#c9a84c] text-[#07090f] font-bold rounded-xl hover:bg-[#d4b55f] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <AnimatePresence>
                  {scanResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                    >
                      {scanResult}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="border-t border-white/5 px-6 py-3 flex items-center justify-between">
            <span className="text-white/20 text-xs font-mono">
              POY 2026 Admin v1.0
            </span>
            <button
              onClick={() => {
                setAuthed(false);
                setPw("");
              }}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onRegister }: { onRegister: () => void }) {
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
              Register Free
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-mono">
            © 2026 Maranatha Visvasa Samajam. All rights
            reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://www.youtube.com/@MaranathaTemple"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/8 hover:border-[#ff0000]/40 hover:bg-[#ff0000]/5 transition-all duration-300"
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
              className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/8 hover:border-[#25d366]/40 hover:bg-[#25d366]/5 transition-all duration-300"
              aria-label="Join Maranatha Temple WhatsApp Community"
            >
              <WhatsAppIcon className="w-4 h-4 text-white/30 group-hover:text-[#25d366] transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                Join Community
              </span>
            </a>
            <a
              href="https://www.instagram.com/maranatha_temple"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/8 hover:border-[#e1306c]/40 hover:bg-[#e1306c]/5 transition-all duration-300"
              aria-label="Follow Maranatha Temple on Instagram"
            >
              <InstagramIcon className="w-4 h-4 text-white/30 group-hover:text-[#e1306c] transition-colors" />
              <span className="text-white/30 group-hover:text-white/70 text-xs transition-colors">
                @maranatha_temple
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
  const [showAdmin, setShowAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const [adminEmail, setAdminEmail] = useState("");

  const [adminPassword, setAdminPassword] = useState("");

  const [adminLoading, setAdminLoading] = useState(false);

  const [adminError, setAdminError] = useState("");
  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data }) => {
        setSession(data.session);
      });

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    return () => subscription.unsubscribe();
  }, []);
  async function adminLogin() {
    setAdminLoading(true);
    setAdminError("");

    const { error } =
      await getSupabase().auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

    if (error) {
      setAdminError(error.message);
    }

    setAdminLoading(false);
  }
  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow =
      showRegister || showAdmin ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRegister, showAdmin]);

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
        <Hero onRegister={() => setShowRegister(true)} />
        <EventBanner onRegister={() => setShowRegister(true)} />
        <About />
        <Speakers />
        <Schedule />
        <Gallery />
        <PreviousThemes />
        <FAQSection />
        <Contact />
      </main>

      <Footer onRegister={() => setShowRegister(true)} />

      {/* Register CTA ribbon */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:block"
      >
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center gap-3 px-6 py-3 bg-[#c9a84c] hover:bg-[#d4b55f] text-[#07090f] font-bold rounded-full shadow-[0_8px_40px_rgba(201,168,76,0.4)] transition-all duration-300 hover:shadow-[0_8px_60px_rgba(201,168,76,0.6)] text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Register Free — 15 August 2026
          <ArrowRight className="w-4 h-4" />
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendOTP = async () => {
    if (!email.trim()) {
      setMessage("Please enter your registered email.");
      return;
    }

    setLoading(true);

    const { data, error } = await getSupabase()
      .from("registrations")
      .select("*")
      .eq("email", email.trim())
      .single();

    setLoading(false);

    if (error || !data) {
      setMessage("No registration found with this email.");
      return;
    }

    // For now, just confirm that the email exists.
    // We'll replace this with real OTP sending next.
    setMessage("Email found! OTP sending will be added next.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl p-6 w-[400px] max-w-[90%]">
        <h2 className="text-2xl font-bold text-black mb-4">
          Retrieve QR Pass
        </h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your registered email"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-black placeholder:text-gray-500 mb-4"
        />

        <button
          onClick={sendOTP}
          disabled={loading}
          className="w-full bg-[#c9a84c] text-[#07090f] py-3 rounded-lg font-semibold mb-3"
        >
          {loading ? "Checking..." : "Send OTP"}
        </button>

        {message && (
          <p className="text-center text-sm text-black mb-3">
            {message}
          </p>
        )}

        <button
          onClick={onClose}
          className="w-full border border-gray-300 py-3 rounded-lg text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
}