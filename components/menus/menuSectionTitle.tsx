import { SVGProps } from 'react';

type MenuSectionTitleProps = {
  Icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
};

const MenuSectionTitle = ({ Icon, text }: MenuSectionTitleProps) => (
  <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
    <Icon className="h-5 w-5" />
    <span>{text}</span>
  </div>
);

export default MenuSectionTitle;
