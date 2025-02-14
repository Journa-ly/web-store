import IconButton from 'components/buttons/IconButton';
import PlusBoxIcon from 'icons/PlusBoxIcon';

const NewGenerationButton = ({ onClick }: { onClick: () => void }) => {
  return <IconButton icon={<PlusBoxIcon />} text="New" onClick={onClick} />;
};

export default NewGenerationButton;
