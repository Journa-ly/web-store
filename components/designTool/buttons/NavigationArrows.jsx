import {
  DESELECT_PIPELINE_JOBS,
  SELECT_PIPELINE_JOB,
  useWebSocketData,
  useWebSocketDispatch,
} from '../WebSocketContext';


export default function NavigationArrows() {
  const dispatch = useWebSocketDispatch();
  const { generationsGroups } = useWebSocketData();
  const selectedIndex = generationsGroups.findIndex(gen_group => gen_group.selected === true);
  const generationsIndex = selectedIndex !== -1 ? selectedIndex + 1 : 0;

  const selectCard = (generation_id) => {
    dispatch({
      type: SELECT_PIPELINE_JOB,
      data: generation_id
    });
  };

  const deselect_generations = () => {
    dispatch({
      type: DESELECT_PIPELINE_JOBS,
    });
  };

  const handleSwipe = (direction) => {
    let newIndex = generationsIndex;

    if (direction === 'left' && generationsIndex < generationsGroups.length) {
      newIndex = generationsIndex + 1;
    } else if (direction === 'right' && generationsIndex > 0) {
      newIndex = generationsIndex - 1;
    }

    if (newIndex !== 0) {
      selectCard(generationsGroups[newIndex - 1].id);
    } else {
      deselect_generations();
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between"
    }}>
      {(generationsGroups && generationsGroups.length) ? (
          <>
            <div style={{ visibility: generationsIndex > 0 ? "initial" : "hidden"}} className="navigation-arrow left-arrow" onClick={() => handleSwipe('right')}>
              &#10094; {/* Left arrow symbol */}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >{generationsIndex + 1}/{generationsGroups.length + 1}</div>
            <div style={{ visibility: generationsIndex < generationsGroups.length ? "initial" : "hidden" }} className="navigation-arrow right-arrow" onClick={() => handleSwipe('left')}>
              &#10095; {/* Right arrow symbol */}
            </div>
          </>
      ) : null}
    </div>
  )
}