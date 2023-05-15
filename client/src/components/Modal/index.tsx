import { RiCloseCircleFill } from 'react-icons/ri';
import './index.scss';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  return (
    <>
      {isOpen && (
        <>
          <div className="modal-overlay" onClick={onClose} />
          <div className="modal">
            <header className="modal__header">
              {title && <h2 className="modal__header__title">{title}</h2>}
              <button className="modal__header__close" onClick={onClose}>
                <RiCloseCircleFill size={25} color="red" cursor={'pointer'} />
              </button>
            </header>
            <section className="modal__content">{children}</section>
          </div>
        </>
      )}
    </>
  );
}
