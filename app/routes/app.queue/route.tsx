import { Header } from "~/components/Header";
import { MainContent } from "~/components/MainContent";
import { Page } from "~/components/Page";

export default function Queue() {
  return (
    <Page>
      <Header title="Workout Queue" />
      <MainContent>This is a queue of upcoming program workouts.</MainContent>
    </Page>
  );
}
