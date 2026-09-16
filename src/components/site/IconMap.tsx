import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Boxes,
  Building2,
  Cable,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cpu,
  Factory,
  Flame,
  FlameKindling,
  HardHat,
  Images,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tornado,
  Users,
  Wind,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Curated icon map (Phase 5 §10): static imports keyed by name so the admin
 * icon field offers a controlled vocabulary and the full lucide namespace
 * never enters the client bundle (TD11 fix). Add icons here ONLY.
 */
export const ICONS = {
  ArrowRight,
  ArrowUpRight,
  Award,
  Boxes,
  Building2,
  Cable,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cpu,
  Factory,
  Flame,
  FlameKindling,
  HardHat,
  Images,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tornado,
  Users,
  Wind,
  Wrench,
  X,
  Zap,
} as const;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export function isIconName(name: string): name is IconName {
  return name in ICONS;
}

/** Resolve a CMS icon string to a component; unknown names fall back to Layers. */
export function getIcon(name?: string | null): LucideIcon {
  return (name && isIconName(name) ? ICONS[name] : undefined) ?? Layers;
}
