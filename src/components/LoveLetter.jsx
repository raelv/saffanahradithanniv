import React from 'react'
import { motion } from 'framer-motion'

export default function LoveLetter() {
    // Konfigurasi animasi
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden bg-beige-100">

            {/* Teks dekoratif vertikal */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 0.3, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden lg:block"
            >
                <span className="font-sans text-xs tracking-[0.8em] text-beige-500 uppercase font-semibold">
                    Chapter I — Saffana
                </span>
            </motion.div>

            <div className="relative max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">

                {/* Frame Foto Polaroid Asimetris */}
                <motion.div
                    initial={{ opacity: 0, rotate: -10, x: -50 }}
                    whileInView={{ opacity: 1, rotate: -4, x: 0 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative z-20 w-64 md:w-80 bg-white p-4 pb-12 rounded-sm shadow-2xl shadow-beige-500/20 md:-mr-16 flex-shrink-0"
                >
                    {/* Ganti src dengan foto kalian yang ada di folder public */}
                    <div className="w-full aspect-square bg-beige-300 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1518199268815-95a201c6ac10?q=80&w=600&auto=format&fit=crop"
                            alt="Our Moment"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                    <p className="absolute bottom-4 left-0 w-full text-center font-serif text-beige-500/80 italic text-sm">
                        Agustus, 2025
                    </p>

                    {/* Selotip dekoratif */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-beige-200/60 backdrop-blur-sm rotate-2 shadow-sm"></div>
                </motion.div>

                {/* Kertas Surat Utama */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative z-10 w-full max-w-2xl"
                >
                    {/* Tumpukan kertas di belakang */}
                    <div className="absolute -inset-2 md:-inset-4 bg-beige-200/60 rounded-xl transform rotate-2"></div>
                    <div className="absolute -inset-2 md:-inset-4 bg-beige-300/30 rounded-xl transform -rotate-1"></div>

                    <div className="relative bg-[#FDFBF7] p-8 md:p-14 rounded-xl shadow-xl shadow-beige-400/20 border border-beige-200/50 backdrop-blur-sm">

                        <motion.div variants={fadeInUp} className="mb-10">
                            <h2 className="font-serif text-3xl md:text-5xl text-beige-500 mb-4">
                                Untuk Saffana,
                            </h2>
                            <div className="w-20 h-[1px] bg-beige-400"></div>
                        </motion.div>

                        <div className="space-y-6 text-beige-500/85 font-sans leading-relaxed text-base md:text-lg text-justify">
                            <motion.p variants={fadeInUp}>
                                Satu tahun mungkin terdengar singkat buat sebagian orang, tapi buat aku, ini adalah 365 hari penuh warna yang nggak akan pernah aku tukar dengan apa pun.
                            </motion.p>
                            <motion.p variants={fadeInUp}>
                                Dari semua kerumitan logika dan *database* yang biasa aku urus tiap hari, cuma kamu satu-satunya hal yang nggak perlu banyak kueri buat bikin aku senyum. Kamu selalu jadi pendengar yang paling sabar.
                            </motion.p>
                            <motion.p variants={fadeInUp}>
                                Aku bangun halaman ini baris demi baris khusus buat kamu. Bukan dari *template* instan, tapi ruang kecil yang kubikin sendiri biar kita punya tempat buat nyimpen memori ini.
                            </motion.p>
                            <motion.p variants={fadeInUp} className="pt-6 font-semibold text-center text-beige-500 text-xl font-serif">
                                Happy 1st Anniversary. I love you.
                            </motion.p>
                        </div>

                        <motion.div variants={fadeInUp} className="mt-12 flex justify-end">
                            <div className="text-right">
                                <p className="font-serif italic text-lg text-beige-400">Dari,</p>
                                <p className="font-serif text-3xl text-beige-500 mt-1">Radith</p>
                            </div>
                        </motion.div>

                    </div>
                </motion.div>

            </div>
        </section>
    )
}