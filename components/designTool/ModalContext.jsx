import { createContext, useContext, useEffect, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openGridModal = () => setIsGridModalOpen(true);
  const closeGridModal = () => setIsGridModalOpen(false);

  useEffect(() => {
    localStorage.getItem('is_open') === 'true' ? setIsModalOpen(true) : setIsModalOpen(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('is_open', isModalOpen);
  }, [isModalOpen]);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        isGridModalOpen,
        openGridModal,
        closeGridModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
