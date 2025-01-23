import Image from 'next/image';

type MenuSectionTitleProps = {
  iconPath: string;
  text: string;
};

const MenuSectionTitle = ({ iconPath, text }: MenuSectionTitleProps) => (
  <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
    <Image src={iconPath} alt="" width={20} height={20} />
    <span>{text}</span>
  </div>
);

export default MenuSectionTitle;
