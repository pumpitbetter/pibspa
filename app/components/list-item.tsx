import type React from "react";

export function ListItem({
  title,
  content,
  action,
  onClick,
}: {
  title: string;
  content?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li className="w-full p-4" onClick={onClick}>
      <div className="flex items-center justify-left">
        <div>
          <div className="text-lg">{title}</div>
          <div className="text-sm text-on-surface-variant">{content}</div>
        </div>
        <div className="ml-auto" onClick={(e) => e.preventDefault()}>
          {action}
        </div>
      </div>
    </li>
  );
}
