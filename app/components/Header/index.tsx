import cx from "classix";

export function Header({ title }: { title: string }) {
  return (
    <header
      className={cx(
        "sticky top-0 flex items-center justify-center h-12",
        "bg-surface text-on-surface",
        "dark:bg-surface-dark dark:text-on-surface-dark"
      )}
    >
      <h1 className={cx("text-2xl")}>{title}</h1>
    </header>
  );
}
