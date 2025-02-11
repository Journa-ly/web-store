import IconButton from 'components/designTool/buttons/IconButton';
import { FolderIcon } from '@heroicons/react/24/outline';
import MyDesignsModal from 'components/modals/MyDesignsModal';
import { useState } from 'react';

export default function MyDesignsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <IconButton
        icon={<FolderIcon className="h-6 w-6" />}
        text="Designs"
        onClick={() => setIsModalOpen(true)}
      />

      <MyDesignsModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
