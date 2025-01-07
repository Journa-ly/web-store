import { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { useSwipeable } from 'react-swipeable';
import CreateGenerationCard from './CreateGenerationCard';
import GenerationCard from './GenerationCard';
import {
  DESELECT_PIPELINE_JOBS,
  SELECT_PIPELINE_JOB,
  useWebSocketData,
  useWebSocketDispatch
} from './WebSocketContext';

const SwipeableCards = () => {
  const dispatch = useWebSocketDispatch();
  const { generationsGroups } = useWebSocketData();
  const selectedIndex = generationsGroups.findIndex((gen_group) => gen_group.selected === true);
  const generationsIndex = selectedIndex !== -1 ? selectedIndex + 1 : 0;
  const containerRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });

  const selectCard = (generation_id) => {
    dispatch({
      type: SELECT_PIPELINE_JOB,
      data: generation_id
    });
  };

  const deselect_generations = () => {
    dispatch({
      type: DESELECT_PIPELINE_JOBS
    });
  };

  const handleSwipe = (direction) => {
    if (!isMobile) return;

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

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    onTouchStart: (event) => {
      const touch = event.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchMove: (event) => {
      const touch = event.touches[0];
      const dx = touch.clientX - startPos.current.x;
      const dy = touch.clientY - startPos.current.y;

      if (Math.abs(dy) > Math.abs(dx)) {
        if (containerRef.current) {
          containerRef.current.style.overflowY = 'auto';
        }
      } else {
        if (containerRef.current) {
          containerRef.current.style.overflowY = 'hidden';
        }
      }
    },
    onTouchEndOrCancel: () => {
      if (containerRef.current) {
        containerRef.current.style.overflowY = 'auto';
      }
    }
  });

  return (
    <div className="swipeable-cards" ref={containerRef} {...handlers}>
      <div
        className="cards-container"
        style={{
          transform: `translateX(-${generationsIndex * 100}%)`,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {[
          <CreateGenerationCard key={-1} />,
          ...generationsGroups.map((generation, index) => (
            <GenerationCard key={generation.id} generation={generation} />
          ))
        ]}
      </div>
    </div>
  );
};

export default SwipeableCards;
