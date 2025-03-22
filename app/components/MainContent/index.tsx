import cx from "classix";

export function MainContent({ children }: { children: React.ReactNode }) {
  return <main className={cx("p-4", "text-on-surface")}>{children}</main>;
}
