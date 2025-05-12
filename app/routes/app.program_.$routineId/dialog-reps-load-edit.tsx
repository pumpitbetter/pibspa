import { useFetcher } from "react-router";
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

export function DialogRepsLoadEdit({
  templateId,
  reps,
  load,
  children,
}: {
  templateId: string;
  reps: number;
  load: number;
  children: React.ReactNode;
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
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="intent" value="editRoutine" />
          <input type="hidden" name="templateId" value={templateId} />
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
                <Label htmlFor="load">Weight %</Label>
                <Input
                  id="load"
                  name="load"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder=""
                  defaultValue={load * 100}
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
