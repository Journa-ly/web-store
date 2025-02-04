import IconButton from '../designTool/buttons/IconButton';
import PlusBoxIcon from '../designTool/icons/PlusBoxIcon';

const NewGenerationButton = ({ onClick }: {onClick: () => void}) => {
  return <IconButton icon={<PlusBoxIcon />} text="New" onClick={onClick} />;
};

export default NewGenerationButton;
