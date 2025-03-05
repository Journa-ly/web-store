import MenuLayout from 'components/layout/menu-layout';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <MenuLayout>{children}</MenuLayout>;
}
