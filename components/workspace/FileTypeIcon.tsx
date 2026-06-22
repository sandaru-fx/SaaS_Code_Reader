import {
  Braces,
  File,
  FileCode2,
  FileJson,
  FileText,
  Globe,
  Palette,
  Settings2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type FileIconStyle = {
  icon: LucideIcon;
  bgClassName: string;
  textClassName: string;
};

function getExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return "";
  }

  return fileName.slice(dotIndex + 1).toLowerCase();
}

function getFileIconStyle(fileName: string): FileIconStyle {
  const extension = getExtension(fileName);

  switch (extension) {
    case "tsx":
    case "jsx":
      return {
        icon: Braces,
        bgClassName: "bg-sky-50",
        textClassName: "text-sky-600",
      };
    case "ts":
    case "mts":
    case "cts":
      return {
        icon: FileCode2,
        bgClassName: "bg-blue-50",
        textClassName: "text-blue-600",
      };
    case "js":
    case "mjs":
    case "cjs":
      return {
        icon: FileCode2,
        bgClassName: "bg-amber-50",
        textClassName: "text-amber-600",
      };
    case "html":
    case "htm":
      return {
        icon: Globe,
        bgClassName: "bg-orange-50",
        textClassName: "text-orange-600",
      };
    case "css":
    case "scss":
    case "sass":
    case "less":
      return {
        icon: Palette,
        bgClassName: "bg-violet-50",
        textClassName: "text-violet-600",
      };
    case "json":
    case "jsonc":
      return {
        icon: FileJson,
        bgClassName: "bg-emerald-50",
        textClassName: "text-emerald-600",
      };
    case "md":
    case "mdx":
      return {
        icon: FileText,
        bgClassName: "bg-slate-100",
        textClassName: "text-slate-600",
      };
    case "py":
    case "rb":
    case "go":
    case "rs":
    case "java":
    case "php":
      return {
        icon: FileCode2,
        bgClassName: "bg-teal-50",
        textClassName: "text-teal-600",
      };
    case "yml":
    case "yaml":
    case "toml":
    case "env":
      return {
        icon: Settings2,
        bgClassName: "bg-slate-100",
        textClassName: "text-slate-600",
      };
    default:
      return {
        icon: File,
        bgClassName: "bg-slate-100",
        textClassName: "text-slate-500",
      };
  }
}

type FileTypeIconProps = {
  fileName: string;
  className?: string;
  iconClassName?: string;
};

export function FileTypeIcon({
  fileName,
  className,
  iconClassName,
}: FileTypeIconProps) {
  const style = getFileIconStyle(fileName);
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md",
        style.bgClassName,
        className
      )}
    >
      <Icon className={cn("size-3", style.textClassName, iconClassName)} />
    </span>
  );
}
