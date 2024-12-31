import { useEffect, useState } from 'react';
import { SERVER_URL } from '../constants';
import WhiteHeart from '../icons/WhiteHeart';
import { SET_IMAGE, useWebSocketDispatch } from '../WebSocketContext';

export default function HeartButton({ initialHearted, imageUUID, enableHeartInteraction=true, onHeartChange }) {
  const [hearted, setHearted] = useState(initialHearted);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const dispatch = useWebSocketDispatch();

  useEffect(() => {
    if (hearted) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500); // Duration of the animation
      return () => clearTimeout(timer);
    }
  }, [hearted]);

  const handleClick = async (e) => {
    if (!enableHeartInteraction) {
      return;
    }
    e.stopPropagation();
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const previousHearted = hearted;
    // Optimistically update the hearted state
    setHearted(!hearted);

    try {
      const response = await fetch(`${SERVER_URL}/images/generation_group_image/${imageUUID}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Optionally, process the response data
      // Notify parent component if needed
      if (onHeartChange) {
        onHeartChange(!previousHearted);
      }

      dispatch({
        type: SET_IMAGE,
        data,
      })
    } catch (error) {
      // Revert the hearted state if the fetch fails
      setHearted(previousHearted);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`heart-btn ${enableHeartInteraction ? 'flex-grow' : ''}`}
      aria-pressed={hearted}
      aria-label={hearted ? 'Unheart image' : 'Heart image'}
    >
      <WhiteHeart classNames={`heart-icon ${hearted ? 'hearted' : ''} ${animate ? 'animate' : ''}`} />
    </button>
  );
}
