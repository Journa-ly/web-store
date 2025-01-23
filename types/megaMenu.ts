// types/megaMenu.ts

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuSection {
  title?: string;
  links: MegaMenuLink[];
}

export interface MegaMenuItem {
  label: string;
  sections?: MegaMenuSection[];
  highlight?: React.ReactNode; // e.g. an image or special offer block
}
