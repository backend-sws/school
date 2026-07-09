import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import type { Auth, PortalConfig } from "@/types";
import { useAuth } from "@/hooks/use-can";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenuContent } from "@/components/user-menu-content";
import { UsersRound, Bell, Search } from "lucide-react";
import { useInitials } from "@/hooks/use-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import R2Api from "@/lib/api/r2Api";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/theme-settings";
import { StudentMenuContent } from "@/components/studentMenuContent";
import { SwitchAccountModal } from "@/components/SwitchAccountModal";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { CommandPalette } from "@/components/command-palette";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

/**
 * Notification bell with unread count badge.
 */
export function NotificationHeaderIcon() {
  const { data } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await api.get<{ data: { unread_count: number } }>("/notifications", { params: { filter: "unread", per_page: 1 } });
      return res?.data?.unread_count ?? 0;
    },
    staleTime: 60 * 1000,
  });
  const unreadCount = typeof data === "number" ? data : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/notifications"
          className="relative flex size-9 items-center justify-center rounded-xl text-muted-foreground/60 hover:bg-primary/5 hover:text-primary transition-all duration-300 active:scale-95 group"
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
        >
          <Bell className="size-[1.15rem] transition-transform duration-300 group-hover:rotate-[15deg]" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-primary-foreground border-2 border-background animate-in zoom-in-50 duration-500">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-wider">Notifications</TooltipContent>
    </Tooltip>
  );
}

interface HeaderActionsProps {
  compact?: boolean;
  hideSearch?: boolean;
}

/**
 * Shared header actions: search, notifications, theme, switch account, user menu.
 * Designed for an ultra-premium, modern feel with micro-interactions.
 */
export function HeaderActions({ compact = false, hideSearch = false }: HeaderActionsProps) {
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { auth, can } = useAuth();
  const portalConfig = (auth as (Auth & { portal_config?: PortalConfig }) | null)?.portal_config;
  const portalMenuPermission = portalConfig?.portal_menu_permission ?? "portal";
  const usePortalMenu = can(portalMenuPermission);
  const canSwitchAccount =
    can("view_my_students") ||
    !!auth?.has_multiple_users_same_email;
  const getInitials = useInitials();
  const displayUser = auth?.effective_user ?? auth?.user;
  const displayEmail = canSwitchAccount ? auth?.user?.email : displayUser?.email;


  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && navigator.userAgent.toUpperCase().includes('MAC'));
  }, []);

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Desktop search trigger (Full Mode) */}
        {!hideSearch && !compact && (
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 h-10 w-64 lg:w-80 px-4 rounded-xl border border-border/40 bg-muted/30 text-muted-foreground/50 hover:bg-muted/50 hover:border-primary/20 hover:text-muted-foreground transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary/10"
          >
            <Search className="size-4 shrink-0 transition-colors group-hover:text-primary/70" />
            <span className="flex-1 text-left text-sm font-medium">Search anything…</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-border/50 bg-background/50 text-[10px] font-black tracking-tighter text-muted-foreground/40 group-hover:text-primary/40 transition-colors uppercase">
              {isMac ? "⌘ K" : "Ctrl K"}
            </kbd>
          </button>
        )}

        {/* Compact Search Trigger */}
        {!hideSearch && (compact || true) && (
          <div className={!compact ? "md:hidden" : ""}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="size-9 rounded-xl text-muted-foreground/60 hover:bg-primary/5 hover:text-primary transition-all duration-300 active:scale-90"
                  aria-label="Search"
                >
                  <Search className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-wider">Search</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Notifications */}
        <NotificationHeaderIcon />

        {/* Theme Settings — Styled for Premium */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center size-9 rounded-xl hover:bg-primary/5 transition-colors">
              <ThemeSettings />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-wider">Appearance</TooltipContent>
        </Tooltip>

        {/* Switch account */}
        {canSwitchAccount && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSwitchAccountOpen(true)}
                className="size-9 shrink-0 rounded-xl text-muted-foreground/60 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                aria-label="Switch account"
              >
                <UsersRound className="size-[1.15rem]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-wider">Switch Account</TooltipContent>
            <SwitchAccountModal open={switchAccountOpen} onOpenChange={setSwitchAccountOpen} />
          </Tooltip>
        )}

        <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
                variant="ghost" 
                className="group flex items-center gap-3 p-1 rounded-xl hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/10 h-auto transition-all duration-300"
            >
              <Avatar className="size-8 rounded-lg border border-border/50 transition-colors duration-300 shadow-none">
                <AvatarImage
                  src={R2Api.imageSrc(displayUser?.avatar_url ?? "")}
                  alt={displayUser?.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black rounded-lg uppercase tracking-tighter">
                  {getInitials(displayUser?.name)}
                </AvatarFallback>
              </Avatar>
              
              {!compact && (
                <div className="hidden xl:block text-left pr-2">
                  <div className="text-sm font-black tracking-tight text-foreground leading-none group-hover:text-primary transition-colors duration-300">
                    {displayUser?.name}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                    {displayEmail?.split('@')[0]}
                  </div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl shadow-xl border-border/40 backdrop-blur-3xl bg-background/95" align="end">
            {usePortalMenu ? (
              <StudentMenuContent user={displayUser ?? auth.user} />
            ) : (
              <UserMenuContent user={displayUser ?? auth.user} />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
}
