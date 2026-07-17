import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-40 bg-brand-red hover:bg-brand-red/90 text-white rounded-full p-4 shadow-lg transition-all duration-300"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Panneau chatbot */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[560px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-accent" />
                <span className="font-heading text-lg text-white tracking-wider">VIZBALL Assistant</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Iframe chatbot */}
            <iframe
              src="https://client-express.up.railway.app/chat/cmppr3srn000c1srtefmj4jus"
              className="flex-1 w-full border-none"
              title="Vizball Chatbot"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}