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
import { Button } from "../../components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export function DialogWeightEdit({
  children,
  exerciseId,
  programId,
  exerciseName,
  exerciseWeight,
}: {
  children: React.ReactNode;
  exerciseId: string;
  programId: string;
  exerciseName: string;
  exerciseWeight: number;
}) {
  const fetcher = useFetcher();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exerciseName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="exerciseId" value={exerciseId} />
          <input type="hidden" name="programId" value={programId} />
          <div className="flex flex-col gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="weight">Max weight</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder=""
                defaultValue={exerciseWeight}
              />
            </div>
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
