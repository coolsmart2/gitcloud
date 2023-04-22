import { forwardRef } from 'react';
import './index.scss';

interface SectionProps {
  id: string;
  children: React.ReactNode;
}

const Section = forwardRef(({ id, children }: SectionProps, ref) => {
  return (
    <section
      id={id}
      className="root-section"
      ref={ref as unknown as (node: HTMLElement) => void}
    >
      {children}
    </section>
  );
});

export default Section;
