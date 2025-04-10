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
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export function DialogCompleteSet({
  reps,
  weight,
  children,
}: {
  reps: number;
  weight: number;
  children: React.ReactNode;
}) {
  const fetcher = useFetcher();
  const { weigthUnit } = useLoaderData<typeof clientLoader>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Set</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  name="reps"
                  type="number"
                  placeholder=""
                  defaultValue={reps}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*.*\d*"
                  placeholder=""
                  defaultValue={weight}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
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
