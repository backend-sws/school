import { Bell, Mail, Smartphone, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ChannelIconConfig {
    key: string;
    icon: LucideIcon;
    label: string;
    activeColor: string;
    inactiveColor: string;
}

export const NOTIFICATION_CHANNEL_ICONS: ChannelIconConfig[] = [
    { key: "push", icon: Bell, label: "Push", activeColor: "text-violet-500", inactiveColor: "text-muted-foreground/30" },
    { key: "mail", icon: Mail, label: "Email", activeColor: "text-blue-500", inactiveColor: "text-muted-foreground/30" },
    { key: "sms", icon: Smartphone, label: "SMS", activeColor: "text-emerald-500", inactiveColor: "text-muted-foreground/30" },
    { key: "whatsapp", icon: MessageCircle, label: "WhatsApp", activeColor: "text-green-500", inactiveColor: "text-muted-foreground/30" },
];
