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
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";

export function DialogWeightUnit({ children }: { children: React.ReactNode }) {
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
          <DialogTitle>Weight Unit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" onSubmit={handleSubmit}>
          <input type="hidden" name="intent" value="editWeightUnit" />
          <div className="flex flex-col gap-4">
            <RadioGroup
              name="weigthUnit"
              defaultValue={weigthUnit}
              className="gap-5"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lbs" id="lbs" />
                <Label htmlFor="lbs" className="w-full">
                  Pounds
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kg" id="kg" />
                <Label htmlFor="kg" className="w-full">
                  Kilograms
                </Label>
              </div>
            </RadioGroup>
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
