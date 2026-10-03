import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function VinylPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(null)

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <section className="py-24 px-6 flex flex-col items-center justify-center border-t border-beige-300/30">
            <h2 className="font-serif text-3xl md:text-4xl text-beige-500 mb-12 text-center">
                Play Our Favorite Song
            </h2>

            {/* Masukkan file audio mp3 ke folder public */}
            <audio ref={audioRef} src="/kasih-putih.mp3" loop />

            <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 cursor-pointer" onClick={togglePlay}>

                {/* Piringan Hitam (Vinyl) */}
                <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full rounded-full bg-[#111] shadow-2xl flex items-center justify-center relative overflow-hidden border-4 border-gray-900"
                >
                    {/* Garis-garis tekstur vinyl */}
                    <div className="absolute inset-0 rounded-full border-[20px] border-white/5"></div>
                    <div className="absolute inset-0 rounded-full border-[40px] border-white/5"></div>
                    <div className="absolute inset-0 rounded-full border-[60px] border-white/5"></div>

                    {/* Label Tengah Vinyl (Bisa diganti foto kalian) */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-beige-300 flex items-center justify-center overflow-hidden border-2 border-[#111]">
                        <img
                            src="/foto-kita.jpg"
                            alt="Vinyl Label"
                            className="w-full h-full object-cover"
                        />
                        {/* Lubang tengah */}
                        <div className="absolute w-3 h-3 bg-[#111] rounded-full"></div>
                    </div>
                </motion.div>

                {/* Jarum Pemutar (Stylus) */}
                <motion.div
                    animate={{ rotate: isPlaying ? 25 : 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="absolute -right-8 -top-8 w-8 h-40 origin-top bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-lg z-10"
                ></motion.div>
            </div>

            {/* Tombol Play/Pause ala Video */}
            <div className="mt-12 flex items-center gap-6">
                <button onClick={togglePlay} className="w-14 h-14 rounded-full border border-beige-400 flex items-center justify-center text-beige-500 hover:bg-beige-200 transition">
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
        </section>
    )
}