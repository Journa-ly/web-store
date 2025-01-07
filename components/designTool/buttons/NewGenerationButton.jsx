import PlusBoxIcon from '../icons/PlusBoxIcon';
import { DESELECT_PIPELINE_JOBS, useWebSocketDispatch } from '../WebSocketContext';
import IconButton from './IconButton';

const NewGenerationButton = () => {
  const dispatch = useWebSocketDispatch();

  const deselect_generations = () => {
    dispatch({
      type: DESELECT_PIPELINE_JOBS
    });
  };

  return <IconButton icon={<PlusBoxIcon />} text="New" onClick={() => deselect_generations()} />;
};

export default NewGenerationButton;
