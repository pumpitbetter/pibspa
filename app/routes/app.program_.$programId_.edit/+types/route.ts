import type { MakeGenerics, Route } from "@react-router/dev/routes";
import { clientLoader } from "../route";

export type EditProgramRoute = MakeGenerics<{
  LoaderData: typeof clientLoader;
}>;

export const route = new Route<EditProgramRoute>();
