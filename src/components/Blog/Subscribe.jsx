import { useState } from 'react'
import emailjs from '@emailjs/browser'
import confetti from 'canvas-confetti'

/**
 * Subscribe component — collects reader email and sends a notification
 * to the portfolio owner via EmailJS.
 *
 * Setup: replace the three EMAILJS_* constants with your real credentials.
 *   1. Sign up at https://emailjs.com (free)
 *   2. Create an Email Service (Gmail, Outlook, etc.)
 *   3. Create an Email Template with variables: {{subscriber_email}}, {{to_name}}
 *   4. Copy your Public Key from Account → General
 */
const EMAILJS_SERVICE_ID = 'service_wiecqoh'     // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_pd5vc1f'   // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'GS5FlBE6Yq_LGd1va'      // e.g. 'abc123XYZ...'

export default function Subscribe() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email.trim()) return

        setStatus('loading')
        setErrorMsg('')

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    subscriber_email: email,
                    to_name: 'Nokib',
                    reply_to: email,
                },
                EMAILJS_PUBLIC_KEY
            )

            // Trigger Confetti!
            const count = 200;
            const defaults = {
                origin: { y: 0.7 },
                zIndex: 9999
            };

            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(count * particleRatio)
                });
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });

            setStatus('success')
            setEmail('')
        } catch (err) {
            console.error('EmailJS error:', err)
            setStatus('error')
            setErrorMsg('Something went wrong. Please try again.')
        }
    }

    return (
        <section className="relative mt-24 rounded-[2.5rem] overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-purple-600/5 to-transparent dark:from-primary-500/10 dark:via-purple-500/5" />
            <div className="absolute inset-0 backdrop-blur-3xl bg-white/60 dark:bg-slate-900/60" />

            <div className="relative z-10 p-8 sm:p-12 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-6">
                    <span className="material-icons-outlined text-primary-500 text-2xl">mail_outline</span>
                </div>

                {/* Heading */}
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight mb-3">
                    Stay in the loop
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
                    Get notified when I publish new articles on development, productivity, and everything in between.
                </p>

                {status === 'success' ? (
                    /* Success State */
                    <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <span className="material-icons-outlined text-green-500 text-2xl">check_circle</span>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-bold text-sm tracking-wide">
                            You're subscribed! Talk soon.
                        </p>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-outlined text-slate-400 text-sm pointer-events-none">
                                alternate_email
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                disabled={status === 'loading'}
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading' || !email}
                            className="px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-black uppercase tracking-[0.1em] rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
                        >
                            {status === 'loading' ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Subscribe
                                    <span className="material-icons-outlined text-sm">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Error */}
                {status === 'error' && (
                    <p className="mt-3 text-red-500 dark:text-red-400 text-xs font-medium">
                        {errorMsg}
                    </p>
                )}

                {/* Fine print */}
                <p className="mt-5 text-slate-400 text-[11px] font-medium tracking-wide">
                    No spam. Unsubscribe anytime. I write when I have something worth saying.
                </p>
            </div>
        </section>
    )
}
