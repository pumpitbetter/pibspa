import { useFetcher, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { dbPromise } from "~/db/db";
import type { Route } from "./+types/route";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const db = await dbPromise;
  const program = await db.programs.findOne(params.programId).exec();
  return program?.toMutableJSON();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const programId = formData.get("programId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const db = await dbPromise;
  const program = await db.programs.findOne(programId).exec();

  await program?.update({
    $set: {
      name,
      description,
    },
  });

  return { ok: true };
}

export const handle = {
  hideBottomNav: true,
};

export default function EditProgram({ loaderData }: Route.ComponentProps) {
  const { programId } = useParams();
  const fetcher = useFetcher();

  return (
    <Page>
      <Header title="Edit Program" left={<LinkBack to="/app/program/change" />} />
      <MainContent>
        <fetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="programId" value={programId} />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              defaultValue={loaderData?.name}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={loaderData?.description}
            />
          </div>
          <Button type="submit" className="self-end">
            Save
          </Button>
        </fetcher.Form>
      </MainContent>
    </Page>
  );
}
