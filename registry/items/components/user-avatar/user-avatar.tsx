import type { ComponentProps, Key, ReactNode } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { generateAvatarFallback } from "./generate-avatar-fallback";

type UserAvatarSize = "sm" | "default" | "lg";

type UserAvatarProps = Omit<ComponentProps<typeof Avatar>, "children"> & {
  username: string | undefined;
  userimage: string | undefined | null;
  textSize?: string;
  bgColor?: string;
};

type UserAvatarGroupUser = Omit<UserAvatarProps, "id"> & {
  id?: Key;
};

type UserAvatarGroupProps = Omit<ComponentProps<typeof AvatarGroup>, "children"> & {
  users: UserAvatarGroupUser[];
  max?: number;
  size?: UserAvatarSize;
  avatarClassName?: string;
  overflowClassName?: string;
  renderOverflow?: (remaining: number) => ReactNode;
};

function UserAvatar({
  username,
  userimage,
  className,
  textSize,
  bgColor,
  size = "default",
  ...props
}: UserAvatarProps) {
  return (
    <Avatar
      aria-label={username ? `Avatar de ${username}` : "Avatar de usuário"}
      className={cn("rounded-full", className)}
      size={size}
      {...props}
    >
      <AvatarFallback
        className={cn(
          "bg-primary bg-linear-to-br from-emerald-300 via-emerald-800 to-emerald-900 font-semibold text-primary-foreground",
          bgColor,
          textSize,
        )}
      >
        <span className={textSize}>{generateAvatarFallback(username)}</span>
      </AvatarFallback>
      <AvatarImage src={userimage || undefined} className="object-cover" />
    </Avatar>
  );
}

function UserAvatarGroup({
  users,
  max = 4,
  size = "default",
  avatarClassName,
  overflowClassName,
  renderOverflow = (remaining) => `+${remaining}`,
  className,
  "aria-label": ariaLabel,
  ...props
}: UserAvatarGroupProps) {
  const visibleCount = Math.max(0, Math.floor(max));
  const visibleUsers = users.slice(0, visibleCount);
  const remaining = Math.max(0, users.length - visibleUsers.length);
  const groupLabel = `Grupo com ${users.length} ${users.length === 1 ? "usuário" : "usuários"}`;
  const overflowLabel = `${remaining} ${remaining === 1 ? "usuário adicional" : "usuários adicionais"}`;

  return (
    <AvatarGroup aria-label={ariaLabel ?? groupLabel} className={className} role="group" {...props}>
      {visibleUsers.map((user, index) => {
        const { id, className: userClassName, size: userSize, ...userProps } = user;

        return (
          <UserAvatar
            className={cn(avatarClassName, userClassName)}
            key={id ?? `${user.username ?? "user"}-${index}`}
            size={userSize ?? size}
            {...userProps}
          />
        );
      })}

      {remaining > 0 && (
        <AvatarGroupCount
          aria-label={overflowLabel}
          className={cn(
            "z-10 border border-border bg-muted text-muted-foreground shadow-xs",
            overflowClassName,
          )}
          title={overflowLabel}
        >
          {renderOverflow(remaining)}
        </AvatarGroupCount>
      )}
    </AvatarGroup>
  );
}

export {
  UserAvatar,
  UserAvatarGroup,
  type UserAvatarGroupProps,
  type UserAvatarGroupUser,
  type UserAvatarProps,
  type UserAvatarSize,
};
