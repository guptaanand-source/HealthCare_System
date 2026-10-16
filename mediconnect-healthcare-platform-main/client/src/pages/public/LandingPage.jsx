import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/common/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' }
  })
}
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

// ── Data ──────────────────────────────────────────────────────────────────────
const GOV_SCHEMES = [
  { name: 'Ayushman Bharat', subtitle: 'PM-JAY', desc: '₹5 lakh health cover per family per year for secondary & tertiary hospitalisation.', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: '🏥', link: 'https://pmjay.gov.in' },
  { name: 'CGHS', subtitle: 'Central Govt. Health Scheme', desc: 'Comprehensive health services for central government employees and pensioners.', color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '🏛️', link: 'https://cghs.gov.in' },
  { name: 'ESIC', subtitle: 'Employees State Insurance', desc: 'Medical care for insured workers and their families under the ESI Act 1948.', color: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700', icon: '🛡️', link: 'https://esic.in' },
  { name: 'Janaushadhi', subtitle: 'Generic Medicine', desc: 'Quality generic medicines at 50–90% lower prices at Janaushadhi Kendras nationwide.', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: '💊', link: 'https://janaushadhi.gov.in' },
]

const INSURANCE = [
  { name: 'Star Health Insurance', type: 'Individual & Family', cover: 'Up to ₹25L', emoji: '⭐' },
  { name: 'HDFC ERGO Health', type: 'Optima Restore', cover: 'Up to ₹50L', emoji: '🏦' },
  { name: 'Bajaj Allianz', type: 'Health Guard', cover: 'Up to ₹10L', emoji: '🔰' },
  { name: 'Niva Bupa', type: 'ReAssure 2.0', cover: 'Unlimited', emoji: '💎' },
]

const MEDICAL_LEGENDS = [
  { name: 'Sushruta', era: '600 BCE', role: 'Father of Surgery', contrib: 'Performed the world\'s first recorded surgeries. Described over 300 surgical procedures in Sushruta Samhita.', initials: 'S', bg: 'bg-amber-100', color: 'text-amber-800' },
  { name: 'Dr. B.C. Roy', era: '1882–1962', role: 'Physician & Statesman', contrib: 'Bharat Ratna awardee. Founded premier medical institutions. July 1 is celebrated as Doctors\' Day in his honour.', initials: 'BR', bg: 'bg-blue-100', color: 'text-blue-800' },
  { name: 'Dr. Devi Shetty', era: 'Present', role: 'Cardiac Surgeon', contrib: 'Founder of Narayana Health. Pioneered affordable open-heart surgery for the poor in India.', initials: 'DS', bg: 'bg-green-100', color: 'text-green-800' },
  { name: 'Dr. M.S. Valiathan', era: '1934–2021', role: 'Cardiac & Biomaterial Surgeon', contrib: 'Developed first indigenous heart valve in India. Padma Vibhushan awardee.', initials: 'MV', bg: 'bg-red-100', color: 'text-red-800' },
]

const HEALTH_TIPS = [
  { tip: 'Drink at least 8 glasses of water every day to maintain optimal hydration.', emoji: '💧' },
  { tip: 'Walk for 30 minutes daily — it reduces the risk of heart disease by up to 35%.', emoji: '🚶' },
  { tip: 'Sleep 7–9 hours each night. Poor sleep is linked to obesity, diabetes and depression.', emoji: '😴' },
  { tip: 'Eat a rainbow — different coloured vegetables provide different essential nutrients.', emoji: '🥗' },
  { tip: 'Schedule a preventive health check-up at least once a year.', emoji: '🩺' },
  { tip: 'Limit processed food. Cook at home — you control the oil, salt and sugar.', emoji: '🍳' },
]

const EMERGENCY = [
  { service: 'National Emergency', number: '112', desc: 'Police, Fire, Ambulance', color: 'bg-red-600', icon: '🚨' },
  { service: 'Ambulance', number: '108', desc: 'Free emergency ambulance service', color: 'bg-orange-500', icon: '🚑' },
  { service: 'Health Helpline', number: '104', desc: 'Medical advice & mental health', color: 'bg-blue-600', icon: '📞' },
  { service: 'COVID / Disease', number: '1075', desc: 'National health helpline', color: 'bg-green-600', icon: '🏥' },
]

const HOW_STEPS = [
  { step: '01', title: 'Find the right doctor', desc: 'Search by specialization, see real availability and verified profiles.' },
  { step: '02', title: 'Book a slot instantly', desc: 'Pick a free time slot. The system prevents double-booking automatically.' },
  { step: '03', title: 'Attend consultation', desc: 'Meet your doctor. Receive clinical notes and prescriptions digitally.' },
  { step: '04', title: 'Track your health', desc: 'All prescriptions, reports and history saved in one secure place.' },
]

// ── Live Health Tip Ticker ────────────────────────────────────────────────────
const HealthTipTicker = () => {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HEALTH_TIPS.length), 4500)
    return () => clearInterval(t)
  }, [])
  const tip = HEALTH_TIPS[idx]
  return (
    <div className="bg-primary/5 border-y border-primary/20 py-3 overflow-hidden">
      <div className="page-container flex items-center gap-3">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest flex-shrink-0">💡 Daily Health Tip</span>
        <div className="flex-1 overflow-hidden">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-sm text-neutral-700 truncate"
          >
            {tip.emoji} {tip.tip}
          </motion.p>
        </div>
      </div>
    </div>
  )
}

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
        <div className="page-container h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/>
                <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-neutral-800">Medi<span className="text-primary">Connect</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="text-neutral-500 hover:text-neutral-800 no-underline transition-colors">How it works</a>
            <a href="#schemes" className="text-neutral-500 hover:text-neutral-800 no-underline transition-colors">Schemes</a>
            <a href="#insurance" className="text-neutral-500 hover:text-neutral-800 no-underline transition-colors">Insurance</a>
            <a href="#emergency" className="text-neutral-500 hover:text-red-600 no-underline transition-colors font-medium">Emergency</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Sign up free</Button>
          </div>
        </div>
      </header>

      {/* ── Live Health Tip Ticker ── */}
      <HealthTipTicker />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="bg-gradient-to-br from-neutral-50 via-white to-primary-light/20 border-b border-neutral-200 overflow-hidden">
          <div className="page-container py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.span variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                  India's Smart Healthcare Platform
                </motion.span>
                <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-5">
                  Your health,<br/><span className="text-primary">managed simply.</span>
                </motion.h1>
                <motion.p variants={fadeUp} custom={2} className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg">
                  Connect with verified doctors, book appointments in seconds, access your complete medical history, and benefit from government health schemes — all in one place.
                </motion.p>
                <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                  <Button variant="primary" size="lg" onClick={() => navigate('/register')}>Get started free →</Button>
                  <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>Log in to your account</Button>
                </motion.div>
                <motion.div variants={fadeUp} custom={4} className="mt-6 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Free for patients</span>
                  <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Verified doctors only</span>
                  <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Govt. scheme eligible</span>
                </motion.div>
              </motion.div>

              {/* Hero booking mockup */}
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="hidden md:block">
                <div className="relative">
                  <div className="card p-6 shadow-lg max-w-sm ml-auto">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">DH</div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Dr. Gregory House</p>
                        <p className="text-xs text-neutral-500">Diagnostic Medicine • ₹1000</p>
                      </div>
                      <span className="ml-auto badge badge-confirmed">Online</span>
                    </div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase mb-2">Available slots — Monday</p>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {['9:00', '9:30', '10:00', '11:00', '14:00', '15:30'].map((s, i) => (
                        <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.07 }}
                          className={`text-xs font-medium text-center py-2 rounded-lg border cursor-pointer transition-all ${i === 2 ? 'bg-primary text-white border-primary scale-105' : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-primary'}`}>
                          {s}
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="primary" size="md" className="w-full">Confirm Booking</Button>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                    className="absolute -bottom-4 -left-4 bg-white border border-neutral-200 shadow-md rounded-xl px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-base">✓</div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Appointment Confirmed!</p>
                      <p className="text-[10px] text-neutral-400">Mon 10:00 AM · Dr. House</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── EMERGENCY NUMBERS ── */}
        <section id="emergency" className="bg-red-600 py-10">
          <div className="page-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.p variants={fadeUp} className="text-xs font-bold text-red-200 uppercase tracking-widest mb-3">🚨 Emergency Services — India</motion.p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {EMERGENCY.map((e, i) => (
                  <motion.a key={e.number} variants={fadeUp} custom={i} href={`tel:${e.number}`}
                    className="bg-white/10 hover:bg-white/20 rounded-xl p-4 text-white transition-all no-underline group">
                    <span className="text-2xl">{e.icon}</span>
                    <p className="text-2xl font-black mt-2 group-hover:scale-105 transition-transform">{e.number}</p>
                    <p className="text-sm font-semibold">{e.service}</p>
                    <p className="text-xs text-red-200 mt-0.5">{e.desc}</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-20 bg-white border-b border-neutral-100">
          <div className="page-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="mb-12 text-center">
              <motion.span variants={fadeUp} className="text-xs font-semibold text-primary uppercase tracking-widest">Simple process</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-neutral-900 mt-2">How MediConnect works</motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_STEPS.map((item, i) => (
                <motion.div key={item.step} variants={fadeUp} custom={i} className="card p-6 hover:shadow-md transition-shadow relative">
                  <div className="text-4xl font-extrabold text-primary/10 mb-4 select-none">{item.step}</div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
                  {i < HOW_STEPS.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 text-neutral-300 text-xl">→</div>}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── GOVERNMENT SCHEMES ── */}
        <section id="schemes" className="py-20 bg-neutral-50 border-b border-neutral-200">
          <div className="page-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="mb-10">
              <motion.span variants={fadeUp} className="text-xs font-semibold text-primary uppercase tracking-widest">Government Benefits</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-neutral-900 mt-2 mb-2">Access government health schemes</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-sm text-neutral-500 max-w-xl">Millions of Indians are eligible for free or subsidised healthcare. Check if you qualify.</motion.p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {GOV_SCHEMES.map((scheme, i) => (
                <motion.a key={scheme.name} variants={fadeUp} custom={i} href={scheme.link} target="_blank" rel="noopener noreferrer"
                  className={`card p-5 border no-underline hover:shadow-md transition-all group ${scheme.color}`}>
                  <div className="text-3xl mb-3">{scheme.icon}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${scheme.badge}`}>{scheme.subtitle}</span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-2 mb-1">{scheme.name}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{scheme.desc}</p>
                  <p className="text-xs text-primary font-medium mt-3 group-hover:underline">Check eligibility →</p>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FINANCE & INSURANCE CORNER ── */}
        <section id="insurance" className="py-20 bg-white border-b border-neutral-200">
          <div className="page-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10">
              <motion.span variants={fadeUp} className="text-xs font-semibold text-primary uppercase tracking-widest">Finance & Insurance Corner</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-neutral-900 mt-2 mb-2">Plan your health finances</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-sm text-neutral-500 max-w-xl">Health insurance protects you from unexpected medical expenses. Compare popular plans and choose the right cover.</motion.p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {INSURANCE.map((plan, i) => (
                <motion.div key={plan.name} variants={fadeUp} custom={i}
                  whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                  className="card p-5 border border-neutral-200 transition-all">
                  <div className="text-3xl mb-3">{plan.emoji}</div>
                  <p className="text-xs text-neutral-500 font-medium">{plan.type}</p>
                  <h3 className="text-sm font-bold text-neutral-900 mt-1">{plan.name}</h3>
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-500">Cover</p>
                    <p className="text-lg font-black text-primary">{plan.cover}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Financial tips */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="bg-neutral-900 rounded-2xl p-8 grid sm:grid-cols-3 gap-6">
              {[
                { tip: 'Buy health insurance early — premiums are lower when you\'re young and healthy.', icon: '📊' },
                { tip: 'Prefer family floater plans if you have dependants — more cost-effective than individual policies.', icon: '👨‍👩‍👧' },
                { tip: 'Section 80D of Income Tax Act allows deductions up to ₹25,000 on health insurance premiums.', icon: '🏛️' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-3">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-neutral-300 leading-relaxed">{item.tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── GREAT INDIAN MEDICAL FIGURES ── */}
        <section className="py-20 bg-neutral-50 border-b border-neutral-200">
          <div className="page-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="mb-10 text-center">
              <motion.span variants={fadeUp} className="text-xs font-semibold text-primary uppercase tracking-widest">Inspiring India</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-neutral-900 mt-2">Giants of Indian Medicine</motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-sm text-neutral-500 max-w-xl mx-auto mt-2">These visionaries shaped modern healthcare in India and the world.</motion.p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MEDICAL_LEGENDS.map((person, i) => (
                <motion.div key={person.name} variants={fadeUp} custom={i}
                  whileHover={{ y: -5 }}
                  className="card p-6 text-center transition-all hover:shadow-md">
                  <div className={`w-20 h-20 rounded-full ${person.bg} mx-auto mb-4 flex items-center justify-center`}>
                    <span className={`text-2xl font-black ${person.color}`}>{person.initials}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">{person.name}</h3>
                  <p className="text-xs font-semibold text-primary mb-1">{person.role}</p>
                  <p className="text-[10px] text-neutral-400 mb-3">{person.era}</p>
                  <p className="text-xs text-neutral-600 leading-relaxed">{person.contrib}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FOR PATIENTS ── */}
        <section id="for-patients" className="py-20 bg-white border-b border-neutral-200">
          <div className="page-container grid md:grid-cols-2 gap-14 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="text-xs font-semibold text-primary uppercase tracking-widest">For patients</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-neutral-900 mt-2 mb-4">Your health, organised.</motion.h2>
              <motion.ul variants={stagger} className="space-y-3 mb-7">
                {['Search & filter verified doctors by specialization', 'Real-time slot booking — no double-booking', 'Download and print digital prescriptions', 'Upload and manage lab test reports securely', 'Complete consultation history & medical timeline', 'Government scheme eligibility information', 'Finance & insurance guidance built-in'].map((item, i) => (
                  <motion.li key={item} variants={fadeUp} custom={i} className="flex items-start gap-3 text-sm text-neutral-700">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" viewBox="0 0 12 12" fill="none"><path d="M2 6.5l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={fadeUp} custom={8}>
                <Button variant="primary" size="md" onClick={() => navigate('/register')}>Register as a patient →</Button>
              </motion.div>
            </motion.div>

            {/* Prescription preview card */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="card p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">MG</div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Dr. Meredith Grey</p>
                  <p className="text-xs text-neutral-500">General Surgery · Grey Sloan Hospital</p>
                </div>
                <span className="ml-auto text-xs text-neutral-400">Today</span>
              </div>
              <p className="text-xs font-semibold text-neutral-500 uppercase mb-3">Digital Prescription</p>
              <div className="space-y-3">
                {[{ med: 'Amoxicillin 500mg', sig: 'Twice daily after food', days: '7 days' }, { med: 'Paracetamol 650mg', sig: 'As needed for fever', days: '5 days' }, { med: 'Vitamin D3 60k IU', sig: 'Once a week', days: '4 weeks' }].map((rx, i) => (
                  <motion.div key={rx.med} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} viewport={{ once: true }}
                    className="flex justify-between items-start p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{rx.med}</p>
                      <p className="text-xs text-neutral-500">{rx.sig}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{rx.days}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-neutral-400 text-center mt-4">Illustrative preview — your actual records appear here</p>
            </motion.div>
          </div>
        </section>

        {/* ── FOR DOCTORS ── */}
        <section id="for-doctors" className="py-20 bg-neutral-50 border-b border-neutral-200">
          <div className="page-container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-2xl mb-12">
              <motion.span variants={fadeUp} className="text-xs font-semibold text-primary uppercase tracking-widest">For doctors</motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-neutral-900 mt-2 mb-4">A focused workspace for clinicians.</motion.h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 gap-5 mb-8">
              {[
                { title: 'Visual slot management', desc: 'Set your weekly schedule with an easy day-by-day slot builder. Add or remove slots in seconds.' },
                { title: 'Appointment timeline', desc: 'View pending, confirmed and completed appointments in a clean organised list.' },
                { title: 'Clinical notes & prescriptions', desc: 'Record diagnosis, vitals and treatment in one form. Prescriptions auto-formatted for patients.' },
                { title: 'Patient history access', desc: 'See a patient\'s full medical background before the consultation begins.' },
              ].map((feat, i) => (
                <motion.div key={feat.title} variants={fadeUp} custom={i} className="bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Button variant="secondary" size="md" onClick={() => navigate('/register/doctor')}>Register as a doctor →</Button>
            </motion.div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="page-container text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to take control of your health?</h2>
            <p className="text-primary-100 text-sm mb-8 max-w-md mx-auto opacity-90">Join thousands of patients and doctors on MediConnect. It is completely free for patients.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/register')} className="bg-white text-primary border-white hover:bg-neutral-100">Register as a patient</Button>
              <Button size="lg" onClick={() => navigate('/login')} className="text-white border border-white/40 hover:bg-white/10">Log in</Button>
            </div>
          </motion.div>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3"></div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-neutral-900 text-neutral-400">
        <div className="page-container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="6.5" y="1" width="3" height="14" rx="1.5" fill="white"/>
                <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Medi<span className="text-primary">Connect</span></span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} MediConnect. All rights reserved.</p>
          <div className="flex gap-5 text-xs">
            <Link to="/login" className="hover:text-white no-underline transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white no-underline transition-colors">Patient Registration</Link>
            <Link to="/register/doctor" className="hover:text-white no-underline transition-colors">Doctor Registration</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
