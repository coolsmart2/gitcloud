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
    <div className={isOpen ? 'modal open' : 'modal'}>
      <header className="modal__header">
        {title && <h2 className="modal__header__title">{title}</h2>}
        <button className="modal__header__close" onClick={onClose}>
          <img src="/close-icon.png" />
        </button>
      </header>
      <section className="modal__body">{children}</section>
    </div>
  );
}
