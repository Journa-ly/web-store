import MenuLayout from 'components/layout/menu-layout';
import ChildrenWrapper from './children-wrapper';

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <MenuLayout>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </MenuLayout>
  );
}
