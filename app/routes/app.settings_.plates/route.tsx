import { dbPromise } from "~/db/db";
import type { Route } from "./+types/route";
import { Header } from "~/components/header";
import { MainContent } from "~/components/main-content";
import { Page } from "~/components/page";
import { List } from "~/components/list";
import { ListItem } from "~/components/list-item";
import { defaultSettings } from "~/db/settings";
import { LinkBack } from "~/components/link-back";
import { Button } from "~/components/ui/button";
import { DialogPlateEdit } from "./dialog-plate-edit";
import invariant from "tiny-invariant";
import { Trash2 } from "lucide-react";
import { useFetcher, useSearchParams } from "react-router";

export async function clientLoader() {
  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  return settings ? settings.toMutableJSON() : defaultSettings;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  type Intent = "editPlates" | "addPlates" | "deletePlates";

  const formData = await request.formData();
  const intent = formData.get("intent") as Intent;
  invariant(intent, "intent not found");

  switch (intent) {
    case "editPlates":
      return await editPlates(formData);
    case "addPlates":
      return await addPlates(formData);
    case "deletePlates":
      return await deletePlates(formData);
    default:
      throw new Error("Unknown intent");
  }
}

export default function Plates({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const { weigthUnit, plates } = loaderData;
  const sortedPlates = plates?.sort((a, b) => b.weight - a.weight);

  const [searchParams] = useSearchParams();

  return (
    <Page>
      <Header
        left={<LinkBack to={searchParams.get("back") ?? "/app/settings"} />}
        title="Plates"
        right={
          <DialogPlateEdit>
            <Button variant="ghost" className="text-primary">
              Add
            </Button>
          </DialogPlateEdit>
        }
      />
      <MainContent>
        <List>
          {sortedPlates?.map((p) => (
            <DialogPlateEdit key={p.weight} weight={p.weight} count={p.count}>
              <ListItem
                title={p.weight + " " + weigthUnit}
                content={p.count + " plates"}
                action={
                  <Button
                    variant="ghost"
                    onClick={async () =>
                      await fetcher.submit(
                        {
                          intent: "deletePlates",
                          weight: p.weight,
                        },
                        { method: "POST" }
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                }
              />
            </DialogPlateEdit>
          ))}
        </List>
      </MainContent>
    </Page>
  );
}

async function editPlates(formData: FormData) {
  const weight = Number(formData.get("weight") ?? 0);
  const count = Number(formData.get("count") ?? 0);

  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();

  invariant(settings, "Settings not found");

  await settings.modify((doc) => {
    const plates = doc.plates?.map((item) => {
      if (item.weight === weight) {
        return {
          ...item,
          count: count,
        };
      }
      return item;
    });

    doc.plates = plates;
    return doc;
  });

  return settings ? settings.toMutableJSON() : defaultSettings;
}

async function addPlates(formData: FormData) {
  const weight = Number(formData.get("weight") ?? 0);
  const count = Number(formData.get("count") ?? 0);

  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();

  invariant(settings, "Settings not found");

  let modified = false;
  await settings.modify((doc) => {
    const plates = doc.plates?.map((item) => {
      if (item.weight === weight) {
        modified = true;
        return {
          ...item,
          count: item.count + count,
        };
      }
      return item;
    });

    if (!modified) {
      plates?.push({ weight, count });
    }

    doc.plates = plates;
    return doc;
  });

  return settings ? settings.toMutableJSON() : defaultSettings;
}

async function deletePlates(formData: FormData) {
  const weight = Number(formData.get("weight") ?? 0);
  const db = await dbPromise;
  const settings = await db.settings.findOne().exec();
  invariant(settings, "Settings not found");

  await settings.modify((doc) => {
    doc.plates = doc.plates?.filter((item) => item.weight !== weight);
    return doc;
  });

  return settings ? settings.toMutableJSON() : defaultSettings;
}
