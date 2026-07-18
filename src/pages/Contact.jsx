import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '../lib/LanguageContext';
import t from '../lib/translations';

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className={className}>

      {children}
    </motion.div>);

}

export default function Contact() {
  const { lang } = useLang();
  const tr = t[lang];

  const contactInfo = [
    { icon: MapPin, label: tr.contact_info_address, value: 'Cameroun' },
    { icon: Mail, label: tr.contact_info_email, value: "contact@vizball.com" },
    { icon: Globe, label: tr.contact_info_website, value: "www.vizball.com" }];

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="w-full h-full bg-gray-900" />

        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="font-body text-sm font-bold uppercase tracking-widest text-accent hidden">{tr.contact_badge}</span>
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl text-white mt-2">
                {tr.contact_title}<span className="text-[hsl(var(--background))]">{tr.contact_title2}</span>
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Info */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="font-heading text-4xl text-foreground mt-3 mb-6">
                  {tr.contact_title2}
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-8">
                  {tr.contact_intro}
                </p>
                <div className="space-y-6">
                  {contactInfo.map((info, i) =>
                  <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <info.icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground">{info.label}</p>
                        <p className="font-body text-foreground font-medium mt-1">{info.value}</p>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection>
                {sent ?
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                      <Send size={28} className="text-accent" />
                    </div>
                    <h3 className="font-heading text-3xl text-foreground mb-2">{tr.contact_sent_title}</h3>
                    <p className="font-body text-muted-foreground">{tr.contact_sent_desc}</p>
                  </div> :

                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{tr.contact_name}</label>
                        <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={tr.contact_name_placeholder}
                        required
                        className="bg-muted border-border" />

                      </div>
                      <div>
                        <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{tr.contact_email}</label>
                        <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={tr.contact_email_placeholder}
                        required
                        className="bg-muted border-border" />

                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{tr.contact_subject}</label>
                      <Input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={tr.contact_subject_placeholder}
                      required
                      className="bg-muted border-border" />

                    </div>
                    <div>
                      <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">{tr.contact_message}</label>
                      <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={tr.contact_message_placeholder}
                      rows={6}
                      required
                      className="bg-muted border-border" />

                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-primary font-body font-bold uppercase tracking-wider py-6">
                      <Send size={16} className="mr-2" />
                      {tr.contact_send}
                    </Button>
                  </form>
                }
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>);

}