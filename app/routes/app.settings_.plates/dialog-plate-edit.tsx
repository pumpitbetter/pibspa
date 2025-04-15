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

export function DialogPlateEdit({
  children,
  weight,
  count,
}: {
  children: React.ReactNode;
  weight?: number | null;
  count?: number | null;
}) {
  const fetcher = useFetcher();

  const intent = weight || count ? "editPlates" : "addPlates";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {intent === "editPlates" ? "Edit Plates" : "Add Plates"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="intent" value={intent} />
          <div className="flex flex-col gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                name="weight"
                type="text"
                inputMode="numeric"
                pattern="\d*.*\d*"
                placeholder=""
                defaultValue={weight || ""}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                name="count"
                type="text"
                inputMode="numeric"
                pattern="\d*.*\d*"
                placeholder=""
                defaultValue={count || ""}
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
