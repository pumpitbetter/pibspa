import { useFetcher, useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { dbPromise } from "~/db/db";
import type { Route } from "./+types/route";
import { useEffect, useState } from "react";
import { Page } from "~/components/page";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { LinkBack } from "~/components/link-back";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const db = await dbPromise;
  const program = await db.programs.findOne(params.programId).exec();
  return program?.toMutableJSON();
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "program_update") {
    const programId = formData.get("programId") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const db = await dbPromise;
    const program = await db.programs.findOne(programId).exec();

    if (!program) {
      return new Response("Program not found", { status: 404 });
    }

    if (program.ownerId === "system") {
      return new Response("Cannot edit system programs", { status: 403 });
    }

    await program.update({
      $set: {
        name,
        description,
      },
    });

    return { ok: true };
  }

  return new Response("Invalid intent", { status: 400 });
}

export const handle = {
  hideBottomNav: true,
};

export default function EditProgram({ loaderData }: Route.ComponentProps) {
  const { programId } = useParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.data?.ok) {
      navigate("/app/program/change");
    } else if (fetcher.data) {
      setError("Failed to save changes. Please try again.");
    }
  }, [fetcher.data, navigate]);

  return (
    <Page>
      <Header title="Edit Program" left={<LinkBack to="/app/program/change" />} />
      <MainContent>
        {error && <p className="text-red-500">{error}</p>}
        <Card>
          <CardHeader>
            <CardTitle>Edit Program Details</CardTitle>
            <CardDescription>
              Make changes to your program here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <fetcher.Form method="post">
            <CardContent className="flex flex-col gap-4">
              <input type="hidden" name="intent" value="program_update" />
              <input type="hidden" name="programId" value={programId} />
              <div className="grid w-full items-center gap-1.5">
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
            </CardContent>
            <CardFooter className="flex justify-end pt-4">
              <Button type="submit">Save</Button>
            </CardFooter>
          </fetcher.Form>
        </Card>
      </MainContent>
    </Page>
  );
}

