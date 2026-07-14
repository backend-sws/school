import { useForm, usePage } from '@inertiajs/react';
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Youtube, Loader2 } from 'lucide-react';
import { useInstitution } from '@/hooks/use-institution';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import React, { useState } from 'react';

interface CollegeDetails {
    name: string;
    location: string;
    state: string;
    pincode: string;
    affiliation: string;
    established: string;
    contact: {
        phone: string;
        email: string;
        address: string;
    };
    social: {
        facebook: string;
        twitter: string;
        youtube: string;
        instagram: string;
    };
}

interface PageProps {
    collegeDetails: CollegeDetails;
}

export default function Contact() {
    const { collegeDetails } = usePage<{ props: PageProps }>().props as unknown as PageProps;
    const institution = useInstitution();
    const details = {
        ...institution,
        ...collegeDetails,
        name: institution.name,
        location: institution.location,
        contact: { ...institution.contact, ...collegeDetails?.contact },
    };
    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});

        axios.post('/api/v1/public/contact', data)
            .then(() => {
                toast.success('Message sent successfully! We will get back to you soon.');
                reset();
            })
            .catch((err) => {
                const responseErrors = err.response?.data?.errors || {};
                const formattedErrors: Record<string, string> = {};
                Object.keys(responseErrors).forEach((key) => {
                    if (Array.isArray(responseErrors[key])) {
                        formattedErrors[key] = responseErrors[key][0];
                    } else {
                        formattedErrors[key] = responseErrors[key];
                    }
                });
                setFormErrors(formattedErrors);
                toast.error(err.response?.data?.message || 'Failed to send message. Please check the form for errors.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const contactCards = [
        {
            icon: Phone,
            title: 'Phone',
            value: details.contact.phone || '',
            href: `tel:${details.contact.phone || ''}`,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20'
        },
        {
            icon: Mail,
            title: 'Email',
            value: details.contact.email || '',
            href: `mailto:${details.contact.email || ''}`,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20'
        },
        {
            icon: MapPin,
            title: 'Address',
            value: details.contact.address,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20'
        }
    ];

    const socialLinks = [
        { icon: Facebook, href: details.social?.facebook, label: 'Facebook' },
        { icon: Twitter, href: details.social?.twitter, label: 'Twitter' },
        { icon: Instagram, href: details.social?.instagram, label: 'Instagram' },
        { icon: Youtube, href: details.social?.youtube, label: 'Youtube' },
    ];

    return (
        <PublicLayout
            title={`Contact Us | ${institution.name}`}
            description={`Contact ${institution.name}, ${institution.location}. Phone, email, address, and office hours.`}
        >
            {/* Hero Section */}
            <section className="relative py-16 md:py-24 bg-background overflow-hidden">
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                        Get In Touch
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-foreground tracking-tight">
                        Contact Us
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                    </p>

                    <nav className="flex justify-center items-center space-x-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
                        <a href="/" className="hover:text-primary transition-colors">Home</a>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-foreground">Contact Us</span>
                    </nav>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="pb-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Left Side: Contact Info */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
                                <p className="text-muted-foreground">
                                    Reach out to us through any of these channels or visit our campus during office hours.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {contactCards.map((card, idx) => {
                                    const Icon = card.icon;
                                    const Wrapper = card.href ? 'a' : 'div';
                                    return (
                                        <Wrapper
                                            key={idx}
                                            href={card.href}
                                            className={cn(
                                                "natural-card flex items-start gap-5 p-6 rounded-2xl group transition-all duration-300",
                                                card.href && "hover:border-primary/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110",
                                                card.bg, card.color, card.border
                                            )}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                                    {card.title}
                                                </p>
                                                <p className="text-foreground font-semibold leading-relaxed">
                                                    {card.value}
                                                </p>
                                            </div>
                                        </Wrapper>
                                    );
                                })}
                            </div>

                            {/* Social Links */}
                            <div className="pt-6 border-t border-border/50">
                                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest">Follow Us</h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, idx) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={idx}
                                                href={social.href}
                                                aria-label={social.label}
                                                className="w-11 h-11 rounded-full flex items-center justify-center border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="natural-card bg-card p-8 md:p-10 rounded-3xl border border-border relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />

                                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                            <Input id="name" placeholder="John Doe" className="bg-background/50 border-border focus:ring-primary h-12 rounded-xl" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                            {formErrors.name && <p className="text-xs text-destructive mt-1">{formErrors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                                            <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50 border-border focus:ring-primary h-12 rounded-xl" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                            {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                                            <Input id="phone" placeholder="+91 0000 000 000" className="bg-background/50 border-border focus:ring-primary h-12 rounded-xl" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                            {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</Label>
                                            <Input id="subject" placeholder="How can we help?" className="bg-background/50 border-border focus:ring-primary h-12 rounded-xl" value={data.subject} onChange={e => setData('subject', e.target.value)} />
                                            {formErrors.subject && <p className="text-xs text-destructive mt-1">{formErrors.subject}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Message</Label>
                                        <Textarea id="message" placeholder="Type your message here..." className="min-h-[150px] bg-background/50 border-border focus:ring-primary rounded-xl p-4" value={data.message} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('message', e.target.value)} required />
                                        {formErrors.message && <p className="text-xs text-destructive mt-1">{formErrors.message}</p>}
                                    </div>

                                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 group/btn relative overflow-hidden transition-all active:scale-[0.98]">
                                        <span className="relative z-10 flex items-center gap-2">
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
