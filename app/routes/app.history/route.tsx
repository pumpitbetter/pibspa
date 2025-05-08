import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { Calendar } from "~/components/ui/calendar";

export default function History() {
  return (
    <Page>
      <Header title="History" />
      <MainContent>
        <Calendar
          classNames={{
            head_row: "flex justify-between",
            row: "flex w-full justify-between mt-2 min-h-[36px]",
          }}
        />
      </MainContent>
    </Page>
  );
}
