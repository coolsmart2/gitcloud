interface RepoProps {
  name: string;
  value: string;
  defaultChecked: boolean;
  children: React.ReactNode;
}

export default function Radio({
  name,
  value,
  defaultChecked,
  children,
}: RepoProps) {
  return (
    <label>
      <input
        type="radio"
        value={value}
        name={name}
        defaultChecked={defaultChecked}
      />
      {children}
    </label>
  );
}
