import { FaXTwitter, FaInstagram, FaLinkedin, FaTiktok, FaYoutube, FaFacebook } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

interface PlatformIconProps {
  platform: string;
  className?: string;
}

export function PlatformIcon({ platform, className }: PlatformIconProps) {
  const p = platform.toLowerCase();
  
  if (p === 'twitter' || p === 'x') {
    return <FaXTwitter className={cn(className)} />;
  }
  if (p === 'instagram') {
    return <FaInstagram className={cn(className)} />;
  }
  if (p === 'linkedin') {
    return <FaLinkedin className={cn(className)} />;
  }
  if (p === 'tiktok') {
    return <FaTiktok className={cn(className)} />;
  }
  if (p === 'youtube') {
    return <FaYoutube className={cn(className)} />;
  }
  if (p === 'facebook') {
    return <FaFacebook className={cn(className)} />;
  }
  return <Mail className={cn(className)} />;
}
