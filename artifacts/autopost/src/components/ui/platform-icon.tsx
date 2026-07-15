import { FaXTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export function PlatformIcon({ platform, className }: PlatformIconProps) {
  const p = platform.toLowerCase();
  
  if (p === 'twitter' || p === 'x') {
    return <FaXTwitter className={cn("text-foreground", className)} />;
  }
  if (p === 'instagram') {
    return <FaInstagram className={cn("text-pink-600", className)} />;
  }
  if (p === 'linkedin') {
    return <FaLinkedin className={cn("text-blue-600", className)} />;
  }
  if (p === 'tiktok') {
    return <FaTiktok className={cn("text-foreground", className)} />;
  }
  return <Mail className={cn("text-muted-foreground", className)} />;
}
