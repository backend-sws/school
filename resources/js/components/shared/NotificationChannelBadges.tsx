import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NOTIFICATION_CHANNEL_ICONS } from "@/constants/shared/notificationChannels";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";

interface NotificationChannelBadgesProps {
    /** Active channel keys, e.g. ['push', 'mail', 'sms', 'whatsapp'] */
    activeChannels: string[];
    /** Show all channels (active + inactive) or only active ones */
    showInactive?: boolean;
    /** Size variant */
    size?: "sm" | "md";
}

/**
 * Renders small channel icons (Push, Email, SMS, WhatsApp) as badges.
 * Active channels are colored, inactive are faded.
 */
export function NotificationChannelBadges({
    activeChannels,
    showInactive = true,
    size = "sm",
}: NotificationChannelBadgesProps) {
    const icons = showInactive
        ? NOTIFICATION_CHANNEL_ICONS
        : NOTIFICATION_CHANNEL_ICONS.filter((c) => activeChannels.includes(c.key));

    const iconSize = size === "sm" ? "size-3" : "size-3.5";

    return (
        <div className="flex items-center gap-1">
            <Each
                of={icons}
                keyExtractor={(c) => c.key}
                render={(channel) => {
                    const isActive = activeChannels.includes(channel.key);
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span
                                    className={cn(
                                        "inline-flex items-center justify-center rounded-md transition-colors",
                                        size === "sm" ? "size-5" : "size-6",
                                        isActive ? channel.activeColor : channel.inactiveColor
                                    )}
                                >
                                    <channel.icon className={iconSize} />
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-[10px]">
                                {channel.label} {isActive ? "✓" : "(not configured)"}
                            </TooltipContent>
                        </Tooltip>
                    );
                }}
            />
        </div>
    );
}
