import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useInstitution } from '@/hooks/use-institution';
import { Button } from '@/components/ui/button';

export function AboutContact() {
    const { contact } = useInstitution();

    return (
        <section className="py-24 bg-card relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left: Contact Info */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            Connect With Us
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground leading-tight">
                            Have Questions? <br />
                            <span className="text-primary italic">We're Here to Help.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-12 max-w-lg leading-relaxed">
                            Whether you are a prospective student, parent, or alumnus, we welcome your inquiries and feedback.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-background border border-border/50 group hover:border-primary/30 transition-all duration-300">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Call Us</div>
                                <div className="text-foreground font-bold">{contact.phone}</div>
                            </div>

                            <div className="p-6 rounded-3xl bg-background border border-border/50 group hover:border-primary/30 transition-all duration-300">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Email Us</div>
                                <div className="text-foreground font-bold">{contact.email}</div>
                            </div>

                            <div className="p-6 rounded-3xl bg-background border border-border/50 group hover:border-primary/30 transition-all duration-300 sm:col-span-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Visit Us</div>
                                <div className="text-foreground font-bold">{contact.address}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Inquiry Form (Minimalist) */}
                    <div className="bg-background border border-border rounded-[2.5rem] p-10 md:p-12 relative">
                        <h3 className="text-2xl font-bold font-serif mb-8 text-foreground">Quick Inquiry</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
                                    <input type="text" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Mobile No.</label>
                                    <input type="tel" className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="+91 0000 000 000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Your Message</label>
                                <textarea rows={4} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="How can we help you?" />
                            </div>
                            <Button className="w-full h-auto py-4 rounded-xl font-bold group">
                                Send Message
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}
