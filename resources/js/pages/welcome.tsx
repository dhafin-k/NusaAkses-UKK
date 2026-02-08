"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Clock,
  DollarSign,
  MapPin,
  BarChart3,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useRef } from "react";

export default function LandingPage() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <div className="w-full bg-black overflow-hidden">

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:44px_44px]"></div>

        {/* Content */}
        <motion.div
          ref={ref}
          style={{ y, opacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-8"
          >
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">Sistem Parkir Terdepan</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-transparent"
          >
            NusaAkses
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl text-slate-300 mb-4 font-light"
          >
            Parkir Lebih Mudah, Hidup Lebih Tenang
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto"
          >
            Sistem manajemen parkir modern dengan real-time monitoring, auto billing, dan analytics lengkap dalam satu platform
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-7 text-lg rounded-full shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300 group"
              >
                Mulai Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {/* <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-700 text-slate-700 hover:bg-slate-500 hover:border-slate-600 px-10 py-7 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
              >
                Login
              </Button>
            </Link> */}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Gratis 30 Hari</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Tanpa Kartu Kredit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Setup 5 Menit</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-slate-500 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: FEATURES SHOWCASE */}
      <section className="relative py-32 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Teknologi terdepan untuk kemudahan pengelolaan parkir Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Real-Time Monitoring"
              description="Pantau kapasitas parkir secara langsung dengan update otomatis setiap detik"
              gradient="from-yellow-500 to-orange-600"
              delay={0.1}
            />
            <FeatureCard
              icon={<DollarSign className="h-10 w-10" />}
              title="Auto Billing"
              description="Sistem penghitungan biaya otomatis berdasarkan durasi parkir dengan akurasi tinggi"
              gradient="from-green-500 to-emerald-600"
              delay={0.2}
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10" />}
              title="Analytics Dashboard"
              description="Laporan lengkap dan insight bisnis untuk pengambilan keputusan yang tepat"
              gradient="from-blue-500 to-cyan-600"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: BENTO GRID FEATURES */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Fitur lengkap untuk mengelola parkir dengan efisien dan profesional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            <BentoCard
              icon={<MapPin className="h-6 w-6" />}
              title="Multi-Area Support"
              description="Kelola multiple area parkir dalam satu dashboard terpadu"
              gradient="from-violet-500/20 to-purple-500/20"
              className="md:col-span-2"
            />
            <BentoCard
              icon={<Car className="h-6 w-6" />}
              title="Smart Capacity"
              description="Monitoring kapasitas real-time dengan alert otomatis"
              gradient="from-blue-500/20 to-cyan-500/20"
            />
            <BentoCard
              icon={<Clock className="h-6 w-6" />}
              title="Instant Checkout"
              description="Proses checkout cepat dengan kalkulasi biaya otomatis"
              gradient="from-green-500/20 to-emerald-500/20"
            />
            <BentoCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Laporan Lengkap"
              description="Export laporan transaksi dan pendapatan dengan mudah"
              gradient="from-orange-500/20 to-red-500/20"
              className="md:col-span-2"
            />
            <BentoCard
              icon={<Shield className="h-6 w-6" />}
              title="Keamanan Terjamin"
              description="Data terenkripsi dengan sistem backup otomatis"
              gradient="from-indigo-500/20 to-purple-500/20"
            />
            <BentoCard
              icon={<Users className="h-6 w-6" />}
              title="User Management"
              description="Role-based access untuk tim petugas Anda"
              gradient="from-cyan-500/20 to-blue-500/20"
              className="md:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: STATS */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-black via-blue-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StatCard number="10K+" label="Transaksi per Bulan" delay={0.1} />
            <StatCard number="99.9%" label="Uptime Guarantee" delay={0.2} />
            <StatCard number="24/7" label="Support Ready" delay={0.3} />
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA FINAL */}
      <section className="relative py-32 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm mb-8">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">Bergabung dengan Kami</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Siap untuk NusaAkses?
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Bergabunglah dengan ratusan pengelola parkir yang sudah mempercayai NusaAkses untuk bisnis mereka
            </p>

            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-8 text-xl rounded-full shadow-2xl shadow-blue-500/50 hover:shadow-cyan-500/50 transition-all duration-300 group"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Gratis 30 hari</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Tanpa kartu kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Setup 5 menit</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-black border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              NusaAkses
            </h3>
            <p className="text-slate-500 text-sm">
              © 2026 NusaAkses. Sistem parkir digital untuk Indonesia.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Tentang</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Fitur</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Bantuan</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl"
    >
      <div className={`inline-flex rounded-2xl bg-gradient-to-br ${gradient} p-4 mb-6 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </motion.div>
  );
}

// Bento Card Component
function BentoCard({ icon, title, description, gradient, className }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-sm p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 ${className || ""}`}
    >
      <div className="relative z-10">
        <div className="inline-flex rounded-xl bg-white/10 p-3 mb-4 backdrop-blur-sm">
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-sm">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ number, label, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
        {number}
      </div>
      <div className="text-xl text-slate-400">{label}</div>
    </motion.div>
  );
}
