"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { ReactNode, MouseEvent } from "react";

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LoadingLink({
  href,
  children,
  className,
  onClick,
}: LoadingLinkProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startLoading();

    if (onClick) {
      onClick();
    }

    // Small delay for better UX
    setTimeout(() => {
      stopLoading();
      router.push(href);
    }, 100);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
