import { useEffect } from 'react';
import CartFormField from './CartFormField';
import { useModal } from './ModalContext';
import SlideOutModal from './SlideModal';
import SwipeableCards from './SwipeableCards';
import {
  PIPELINE_JOB,
  SET_PIPELINE_JOBS,
  useWebSocketData,
  useWebSocketDispatch
} from './WebSocketContext';
import DesignButton from './buttons/DesignButton';
import { SERVER_URL } from './constants';
import { get_generation_image_id_from_url } from './helpers';

export default function DesignTool() {
  const data = useWebSocketData();
  console.log('data: ', data);
  const { generationsGroups } = useWebSocketData();
  const dispatch = useWebSocketDispatch();
  const shared_image_id = get_generation_image_id_from_url();
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchSharedGeneration = () => {
      if (shared_image_id) {
        fetch(`${SERVER_URL}/images/generation_group_image/shared/${shared_image_id}`, {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          credentials: 'include'
        })
          .then((response) => response.json())
          .then((data) => {
            const id_exists = generationsGroups.some((obj) => obj.id === data.id);
            if (!id_exists) {
              openModal();
              dispatch({
                type: PIPELINE_JOB,
                data
              });
            }
          })
          .catch((error) => {
            console.error('Failed to fetch shared image data:', error);
          });
      }
    };

    const fetchData = () => {
      return fetch(`${SERVER_URL}/images/generation_group/session`, {
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: SET_PIPELINE_JOBS,
            data: data
          });
          return data;
        })
        .catch((error) => {
          console.error('Failed to fetch data:', error);
        });
    };

    fetch(`${SERVER_URL}/images/session`, {
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    })
      .then((response) => response.json())
      .then(() => {
        fetchData().then((data) => {
          const generationsExists = data && data.some((obj) => obj.id === shared_image_id);
          if (!generationsExists) {
            fetchSharedGeneration();
          }
        });
      });

    // Fetch data whenever the window gains focus
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  return (
    <div className="app-container locked-component">
      {/* <SelectImageCarouselContainer /> */}
      <DesignButton onClick={openModal} />
      <SlideOutModal isOpen={isModalOpen} onClose={closeModal}>
        <SwipeableCards />
      </SlideOutModal>
      <CartFormField />
    </div>
  );
}
