export function ListItem({
  title,
  content,
  onClick,
}: {
  title: string;
  content?: string;
  onClick?: () => void;
}) {
  return (
    <li className="w-full p-4" onClick={onClick}>
      <div className="text-lg">{title}</div>
      <div className="text-sm text-on-surface-variant">{content}</div>
    </li>
  );
}
