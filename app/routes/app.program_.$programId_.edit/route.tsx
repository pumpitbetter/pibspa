import { Header } from "~/components/header";
import { LinkBack } from "~/components/link-back";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";

export default function EditProgram() {
  return (
    <Page>
      <Header title="Edit Program" left={<LinkBack to="/app/program/change" />} />
      <MainContent>
        <p>Edit program screen</p>
      </MainContent>
    </Page>
  );
}
