interface InputModalProps {
  isOpen: boolean;
  onSummit: () => void;
  onClose: () => void;
}

export default function InputModal({
  isOpen,
  onSummit,
  onClose,
}: InputModalProps) {
  return (
    <div className="input-modal-container">
      <Form></Form>
    </div>
  );
}
