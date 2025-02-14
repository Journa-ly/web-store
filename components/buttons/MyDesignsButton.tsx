import IconButton from 'components/designTool/buttons/IconButton';
import ImageGrid from 'icons/ImageGrid';
import MyDesignsModal from 'components/modals/MyDesignsModal';
import { useState } from 'react';
import { UserDesign } from 'types/design';
import { useDesign } from 'components/designs/design-context';

export default function MyDesignsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSelectedDesign, setPreviewImage } = useDesign();

  const handleSelectDesign = (design: UserDesign) => {
    setSelectedDesign(design);
    if (design.image?.image?.image) {
      setPreviewImage(design.image.image.image);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <IconButton icon={<ImageGrid />} text="Designs" onClick={() => setIsModalOpen(true)} />

      <MyDesignsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectDesign={handleSelectDesign}
      />
    </>
  );
}
