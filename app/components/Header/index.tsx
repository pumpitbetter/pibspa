import cx from "classix";

export function Header({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <header
      className={cx(
        "sticky top-0 flex items-center justify-between min-h-[56px] px-4",
        "bg-surface text-on-surface"
      )}
    >
      <div></div>
      <h1 className={cx("text-2xl")}>{title}</h1>
      {right ?? <div></div>}
    </header>
  );
}
