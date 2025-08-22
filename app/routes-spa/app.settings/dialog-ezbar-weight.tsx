import { useFetcher, useLoaderData } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import type { clientLoader } from "~/routes/app.settings/route";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "~/components/ui/input";

export function DialogEzBarWeight({ children }: { children: React.ReactNode }) {
  const fetcher = useFetcher();
  const { ezbarWeight } = useLoaderData<typeof clientLoader>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="intent" value="editEzBarWeight" />
          <div className="flex flex-col gap-4">
            <Label htmlFor="ezbarWeight">EZ Bar Weight</Label>
            <Input
              id="ezbarWeight"
              name="ezbarWeight"
              type="number"
              placeholder=""
              defaultValue={ezbarWeight}
            />
            <div className="flex justify-end gap-4">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
            </div>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
