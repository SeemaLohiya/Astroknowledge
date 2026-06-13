"use client";

import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { FloatingParticles } from "@/components/animations/FloatingParticles";
import { PageTransition } from "@/components/animations/PageTransition";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { PageBanner } from "@/components/ui/PageBanner";
import { SafeImage } from "@/components/ui/SafeImage";
import { GitHubIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  Brain,
  Code2,
  Cpu,
  Globe,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const DEVELOPER = {
  name: "Ishant Goyal",
  photo: "/images/developer/ishant-goyal.png",
  title: "Vice President – Head of Website Development & Management and AI Specialist",
  location: "Jaipur, Rajasthan",
  phone: "+91 6367010131",
  email: "ishantgoyal932@gmail.com",
  whatsapp: "https://wa.me/916367010131",
  linkedin: "https://www.linkedin.com/in/ishant-goyal-740b31290",
  github: "https://github.com/Ishant932",
  instagram: "https://www.instagram.com/ishantgoyal932",
};

const SKILLS = [
  "Next.js & React",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "AI Integration",
  "UI/UX Design",
  "Performance",
  "DevOps",
  "Automation",
  "Cloud Deploy",
];

const EXPERTISE = [
  {
    icon: Globe,
    title: "Web Platforms",
    text: "End-to-end planning, architecture, and delivery of high-performance websites with modern stacks, scalable APIs, and production-grade deployments.",
  },
  {
    icon: Brain,
    title: "Digital Transformation",
    text: "Translating business goals into intuitive digital experiences — from consultation booking flows to e-commerce, dashboards, and multilingual platforms.",
  },
  {
    icon: Bot,
    title: "AI & Automation",
    text: "Integrating Artificial Intelligence for personalization, smart workflows, content assistance, and operational efficiency across web products.",
  },
  {
    icon: Rocket,
    title: "Growth & Optimization",
    text: "Continuous performance tuning, SEO-ready structures, mobile-first UX, analytics-driven improvements, and secure authentication systems.",
  },
];

const STATS = [
  { value: 50, suffix: "+", label: "Projects Led" },
  { value: 99, suffix: "%", label: "Uptime Focus" },
  { value: 24, suffix: "/7", label: "Platform Care" },
  { value: 100, suffix: "%", label: "Code Passion" },
];

const ORBIT_ICONS = [Code2, Cpu, Zap, Sparkles, Bot];

function SocialLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.12, rotate: 4 }}
      whileTap={{ scale: 0.95 }}
      className={`dev-social-btn flex h-12 w-12 items-center justify-center rounded-2xl border text-white shadow-lg transition-shadow hover:shadow-xl ${className}`}
    >
      {children}
    </motion.a>
  );
}

export default function DeveloperPage() {
  const reduceMotion = useReducedMotion();

  return (
    <PageTransition>
      <PageBanner
        title="Developer"
        titleAccent="Information"
        subtitle="The architect behind AstroKnowledge — blending code, creativity & AI."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Developer" }]}
      />

      <section className="dev-page relative overflow-hidden pb-20 pt-4">
        <div className="dev-matrix-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <FloatingParticles count={24} />
        {!reduceMotion && (
          <>
            <motion.div
              className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl"
              animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </>
        )}

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="dev-holo-card relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/20 p-8 md:p-12"
          >
            <div className="dev-holo-shine pointer-events-none absolute inset-0" aria-hidden />
            <div className="dev-scan-line pointer-events-none absolute inset-0" aria-hidden />

            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-8 flex h-56 w-56 items-center justify-center md:h-64 md:w-64">
                <motion.div
                  className="dev-orbit-ring pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-gold/40"
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="dev-orbit-ring-2 pointer-events-none absolute inset-4 rounded-full border border-emerald-400/30"
                  animate={reduceMotion ? undefined : { rotate: -360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                />
                {ORBIT_ICONS.map((Icon, i) => (
                  <motion.span
                    key={i}
                    className="dev-orbit-node pointer-events-none absolute flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-orange text-white shadow-md"
                    style={{
                      top: `${50 + 46 * Math.sin((i / ORBIT_ICONS.length) * Math.PI * 2)}%`,
                      left: `${50 + 46 * Math.cos((i / ORBIT_ICONS.length) * Math.PI * 2)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.span>
                ))}
                <motion.div
                  className="dev-photo-frame relative z-20 h-40 w-40 overflow-hidden rounded-3xl border-4 border-gold/60 shadow-2xl md:h-48 md:w-48"
                  animate={reduceMotion ? undefined : { boxShadow: ["0 0 24px rgba(234,88,12,0.45)", "0 0 48px rgba(16,185,129,0.45)", "0 0 24px rgba(234,88,12,0.45)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <SafeImage
                    src={DEVELOPER.photo}
                    alt={DEVELOPER.name}
                    fill
                    sizes="(max-width: 768px) 160px, 192px"
                    className="object-cover object-top"
                    priority
                    quality={90}
                  />
                </motion.div>
              </div>

              <motion.h1
                className="dev-glitch-name font-display text-4xl font-black text-text-primary md:text-5xl"
                data-text={DEVELOPER.name}
              >
                <ShimmerText>{DEVELOPER.name}</ShimmerText>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-gold md:text-base"
              >
                {DEVELOPER.title}
              </motion.p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-text-muted">
                <MapPin className="h-4 w-4 text-gold" />
                {DEVELOPER.location}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <SocialLink href={DEVELOPER.whatsapp} label="WhatsApp" className="dev-social-wa border-green-400/40 bg-gradient-to-br from-green-500 to-emerald-600">
                  <WhatsAppIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href={DEVELOPER.linkedin} label="LinkedIn" className="dev-social-li border-blue-400/40 bg-gradient-to-br from-blue-600 to-blue-800">
                  <LinkedInIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href={DEVELOPER.github} label="GitHub" className="dev-social-gh border-slate-400/40 bg-gradient-to-br from-slate-700 to-slate-900">
                  <GitHubIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href={DEVELOPER.instagram} label="Instagram" className="dev-social-ig border-pink-400/40 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500">
                  <InstagramIcon className="h-5 w-5" />
                </SocialLink>
                <SocialLink href={`mailto:${DEVELOPER.email}`} label="Email" className="dev-social-mail border-gold/40 bg-gradient-to-br from-gold to-orange">
                  <Mail className="h-5 w-5" />
                </SocialLink>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -6, scale: 1.02 }}
                className="dev-stat-card rounded-2xl border border-gold/20 bg-white/80 p-5 text-center backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-2xl font-bold text-text-primary md:text-3xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 space-y-6"
          >
            {[
              "Ishant Goyal leads the planning, development, optimization, and management of web platforms to ensure high performance and exceptional user experiences. With expertise in modern web technologies and digital transformation, he drives innovative solutions that align with business goals.",
              "He architects full-stack ecosystems — from responsive frontends and secure APIs to database design, payment flows, admin dashboards, and multilingual content systems. Every release is engineered for speed, accessibility, and long-term maintainability.",
              "As an AI Specialist, Ishant focuses on integrating Artificial Intelligence technologies to enhance website functionality, automation, personalization, and operational efficiency — helping spiritual and wellness brands scale digitally without losing their human touch.",
              "From AstroKnowledge's consultation engine and catalog management to deployment pipelines and custom-domain infrastructure, he ensures the platform stays fast, reliable, and continuously evolving for thousands of users across India and beyond.",
            ].map((para, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="dev-bio-card relative overflow-hidden rounded-2xl border border-gold/15 bg-gradient-to-br from-white/90 to-orange/5 p-6 md:p-8"
              >
                <span className="dev-bio-index absolute right-4 top-4 font-display text-5xl font-black text-gold/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="relative text-sm leading-relaxed text-text-body md:text-base">{para}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Skills marquee */}
          <div className="dev-skills-marquee mt-12 overflow-hidden rounded-2xl border border-gold/20 bg-indigo-950/90 py-4">
            <motion.div
              className="dev-marquee-track flex gap-4 whitespace-nowrap px-4"
              animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100"
                >
                  <Code2 className="h-3.5 w-3.5 text-gold" />
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Expertise grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {EXPERTISE.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="dev-expertise-card group rounded-2xl border border-gold/20 bg-white/85 p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-gold/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-indigo/20 text-gold transition-transform group-hover:rotate-6 group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-body">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="dev-cta-card relative mt-14 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-r from-indigo-900 via-violet-900 to-orange-900 p-8 text-center text-white md:p-12"
          >
            <div className="dev-cta-pulse pointer-events-none absolute inset-0" aria-hidden />
            <Sparkles className="mx-auto h-8 w-8 text-gold animate-pulse-glow" />
            <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">Let&apos;s Build Something Extraordinary</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 md:text-base">
              Open to collaborations on web development, AI-powered products, and digital platform management.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href={`tel:${DEVELOPER.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur hover:bg-white/20">
                <Phone className="h-4 w-4" /> {DEVELOPER.phone}
              </a>
              <a href={`mailto:${DEVELOPER.email}`} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur hover:bg-white/20">
                <Mail className="h-4 w-4" /> {DEVELOPER.email}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/about"
                className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                ← Back to About Us
              </Link>
              <a
                href={DEVELOPER.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="dev-cta-btn rounded-full bg-gradient-to-r from-gold to-orange px-6 py-2.5 text-sm font-bold text-white shadow-lg"
              >
                Connect on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
