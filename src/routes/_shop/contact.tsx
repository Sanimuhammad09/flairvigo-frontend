import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/_shop/contact')({
  component: ContactPage,
});

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
    }, 1500);
  };

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Contact Us</h1>
          <p className="text-neutral-500 max-w-xl mx-auto">
            Have a question, concern, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="font-bold text-charcoal text-lg mb-4">Get in Touch</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our support team typically responds within 24 hours during business days.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Email</p>
                  <p className="text-neutral-500 text-sm">support@flairvigo.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Phone</p>
                  <p className="text-neutral-500 text-sm">+1 (555) 0199</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Address</p>
                  <p className="text-neutral-500 text-sm">123 Fashion District<br/>New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal text-white rounded-full flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal text-sm">Business Hours</p>
                  <p className="text-neutral-500 text-sm">Mon - Fri: 9am - 6pm EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm border border-neutral-100 shadow-sm space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2 block">
                    First Name
                  </label>
                  <Input placeholder="Jane" required />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2 block">
                    Last Name
                  </label>
                  <Input placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2 block">
                  Email
                </label>
                <Input type="email" placeholder="jane@example.com" required />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2 block">
                  Subject
                </label>
                <Input placeholder="How can we help?" required />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-2 block">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us more..."
                  className="w-full rounded-sm border border-neutral-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal resize-none"
                />
              </div>

              <Button type="submit" className="w-full py-6 flex items-center justify-center gap-2" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
