import MenuLayout from 'components/layout/menu-layout';

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <MenuLayout>{children}</MenuLayout>;
}
