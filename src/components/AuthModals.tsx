'use client';

import { useUI } from '@/app/context/UIProvider';
import Modal from './ui/Modal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function AuthModals() {
  const {
    isLoginModalOpen,
    closeLoginModal,
    isSignUpModalOpen,
    closeSignUpModal,
    openLoginModal
  } = useUI();

  return (
    <>
      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
        <LoginForm onSuccess={closeLoginModal} />
      </Modal>

      <Modal isOpen={isSignUpModalOpen} onClose={closeSignUpModal}>
        <SignUpForm onSuccess={() => {
          closeSignUpModal();
          openLoginModal(); // Automatically open login after successful sign up
        }} />
      </Modal>
    </>
  );
}