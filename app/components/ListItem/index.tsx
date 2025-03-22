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
      <div className="text">{content}</div>
    </li>
  );
}
