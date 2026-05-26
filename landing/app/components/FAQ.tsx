'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is it free?',
    answer:
      'Yes, fully free while in beta. No credit card, no catch. When we eventually charge, existing beta users will get a generous discount.',
  },
  {
    question: 'Does it read my emails?',
    answer:
      "No. Flyby requests read-only access to your calendar events only. No emails, no contacts, no Drive. We don't want that data — we just need to know when your next meeting starts.",
  },
  {
    question: 'Will it work with Outlook / Apple Calendar?',
    answer:
      'Coming soon. Google Calendar is first, because it covers the most users. Outlook (Microsoft 365) and Apple Calendar are next on the roadmap — sign up to be notified.',
  },
  {
    question: 'Can I customize the lead time?',
    answer:
      'Yes — anywhere from 1 to 15 minutes. Change it anytime from the menu bar icon. You can also snooze a specific reminder if you need a minute.',
  },
  {
    question: 'Where are my tokens stored?',
    answer:
      'Locally on your machine, encrypted by your OS keychain (Keychain Access on Mac, Windows Credential Manager on Windows). Nothing ever touches a Flyby server. Your credentials stay yours.',
  },
  {
    question: 'Does it need to run in the background?',
    answer:
      "Yes, Flyby runs quietly in your menu bar / system tray. It uses less than 1% CPU and around 40MB of RAM — about as demanding as a calculator. You'll barely know it's there, until you need it.",
  },
]

function PlusIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden="true"
    >
      <path
        d="M10 4v12M4 10h12"
        stroke={open ? '#FFB6C1' : 'rgba(255,255,255,0.4)'}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}

function FAQAccordionItem({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${index}`

  return (
    <div
      className="border-b transition-colors duration-200"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <button
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-pastel-pink focus-visible:ring-offset-2 focus-visible:ring-offset-editorial-dark rounded-sm"
      >
        <span
          className="text-base font-medium transition-colors duration-200"
          style={{ color: open ? '#FFB6C1' : 'rgba(255,255,255,0.88)' }}
        >
          {item.question}
        </span>
        <span className="flex-shrink-0">
          <PlusIcon open={open} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25, ease: 'easeOut' },
            }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-8">
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.52)' }}
              >
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  return (
    <section
      className="relative w-full section-pad overflow-hidden"
      style={{ background: '#0A0A0B' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 15% 80%, rgba(255,182,193,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-14">
          <span
            className="text-xs tracking-[0.2em] uppercase font-medium block mb-4"
            style={{ color: '#FFB6C1' }}
          >
            FAQ
          </span>
          <h2
            className="font-serif leading-tight text-white"
            style={{
              fontFamily: 'var(--font-serif), Instrument Serif, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            }}
          >
            Questions?
          </h2>
        </div>

        {/* Accordion */}
        <div
          className="rounded-2xl overflow-hidden p-1"
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.018)',
          }}
        >
          <div className="px-6 lg:px-8">
            {FAQ_ITEMS.map((item, idx) => (
              <FAQAccordionItem key={item.question} item={item} index={idx} />
            ))}
          </div>

          {/* Footer of the FAQ box */}
          <div
            className="mt-2 px-8 py-5 rounded-xl"
            style={{ background: 'rgba(255,182,193,0.04)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Still have questions?{' '}
              <a
                href="mailto:hey@flyby.app"
                className="underline underline-offset-2 transition-colors duration-150 hover:text-white"
                style={{ color: 'rgba(255,182,193,0.65)' }}
              >
                Email us
              </a>{' '}
              — we reply to everything.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
