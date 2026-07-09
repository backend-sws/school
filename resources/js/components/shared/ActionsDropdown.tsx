import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermissionGate } from "@/components/PermissionGate";
import Each from "@/components/Each";

export interface ActionItem {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  /** If set, wraps this item in a PermissionGate. */
  permission?: string;
  /** A separator is rendered before this item when true. */
  separator?: boolean;
}

interface ActionsDropdownProps {
  /** Menu items to render. */
  actions: ActionItem[];
  /** Optional label for the trigger button. Defaults to "Actions". */
  label?: string;
  /** Optional permission required to show the entire dropdown. */
  permission?: string;
  /** Alignment of dropdown content. Defaults to "end". */
  align?: "start" | "center" | "end";
}

export function ActionsDropdown({
  actions,
  label = "Actions",
  permission,
  align = "end",
}: ActionsDropdownProps) {
  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="rounded-xl font-bold gap-2">
          {label}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <Each
          of={actions}
          keyExtractor={(_, i) => i}
          render={(action) => {
            const Icon = action.icon;
            const item = (
              <>
                {action.separator && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={action.onClick}>
                  {Icon && <Icon className="size-4 mr-2" />}
                  {action.label}
                </DropdownMenuItem>
              </>
            );

            return action.permission ? (
              <PermissionGate can={action.permission}>{item}</PermissionGate>
            ) : (
              item
            );
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (permission) {
    return <PermissionGate can={permission}>{menu}</PermissionGate>;
  }

  return menu;
}
