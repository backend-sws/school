import { ShieldCheck, Users, GraduationCap, Building2 } from 'lucide-react';
import { useInstitution } from '@/hooks/use-institution';
import AppLogoIcon from '@/components/app-logo-icon';

interface AdministrationAffiliationProps {
    universityLogo?: string;
    collegeLogo?: string;
}

export function AdministrationAffiliation({ universityLogo, collegeLogo }: AdministrationAffiliationProps) {
    const { name, logoUrl } = useInstitution();

    return (
        <section className="py-24 bg-background overflow-hidden" id="affiliation">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Affiliation Section */}
                    <div className="flex-1 w-full bg-card border border-border rounded-[2.5rem] p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 overflow-hidden border border-primary/20">
                                {collegeLogo ? (
                                    <img src={collegeLogo} alt="College Logo" className="w-full h-full object-contain p-1" />
                                ) : logoUrl ? (
                                    <AppLogoIcon alt="College Logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <ShieldCheck className="w-10 h-10" />
                                )}
                            </div>

                            <h3 className="text-3xl font-bold font-serif mb-6 text-foreground">Institutional Affiliation</h3>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                {name} is proud to be a <span className="text-foreground font-bold italic">Constituent Unit</span> of Patliputra University, Patna. We adhere to the highest standards of academic excellence prescribed by the university.
                            </p>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border overflow-hidden">
                                    {universityLogo ? (
                                        <img
                                            src={universityLogo}
                                            alt="University Logo"
                                            className="w-full h-full object-contain p-1.5"
                                        />
                                    ) : (
                                        <Building2 className="w-6 h-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">University Body</div>
                                    <div className="text-sm font-bold text-foreground">Patliputra University, Patna</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Administration Stats/Highlights */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="p-8 bg-muted/30 rounded-3xl border border-border/50 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-foreground">Governing Body</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Our institution is governed by a dedicated committee of academic experts and community leaders.
                            </p>
                        </div>

                        <div className="p-8 bg-muted/30 rounded-3xl border border-border/50 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-foreground">Faculty Strength</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Over 50+ highly qualified faculty members across Engineering, Science, Commerce, and Arts.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
