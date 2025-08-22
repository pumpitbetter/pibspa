// Type declarations for React Router v7 in source files
// Provides basic Route types before type generation runs

declare module "*/+types/route" {
  import type * as T from "react-router/route-module";

  export interface Info {
    parents: any[];
    id: string;
    file: string;
    path: string;
    params: Record<string, string | undefined>;
    module: any;
    loaderData: any;
    actionData: any;
  }

  export namespace Route {
    export type LinkDescriptors = T.LinkDescriptors;
    export type LinksFunction = () => LinkDescriptors;

    export type MetaArgs = T.CreateMetaArgs<Info>;
    export type MetaDescriptors = T.MetaDescriptors;
    export type MetaFunction = (args: MetaArgs) => MetaDescriptors;

    export type HeadersArgs = T.HeadersArgs;
    export type HeadersFunction = (args: HeadersArgs) => Headers | HeadersInit;

    export type LoaderArgs = T.CreateServerLoaderArgs<Info>;
    export type ClientLoaderArgs = T.CreateClientLoaderArgs<Info>;
    export type ActionArgs = T.CreateServerActionArgs<Info>;
    export type ClientActionArgs = T.CreateClientActionArgs<Info>;

    export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Info>;
    export type ComponentProps = T.CreateComponentProps<Info>;
    export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Info>;
  }
}

// Also handle root types
declare module "../+types/root" {
  import type * as T from "react-router/route-module";

  export interface Info {
    parents: any[];
    id: string;
    file: string;
    path: string;
    params: Record<string, string | undefined>;
    module: any;
    loaderData: any;
    actionData: any;
  }

  export namespace Route {
    export type LinkDescriptors = T.LinkDescriptors;
    export type LinksFunction = () => LinkDescriptors;

    export type MetaArgs = T.CreateMetaArgs<Info>;
    export type MetaDescriptors = T.MetaDescriptors;
    export type MetaFunction = (args: MetaArgs) => MetaDescriptors;

    export type HeadersArgs = T.HeadersArgs;
    export type HeadersFunction = (args: HeadersArgs) => Headers | HeadersInit;

    export type LoaderArgs = T.CreateServerLoaderArgs<Info>;
    export type ClientLoaderArgs = T.CreateClientLoaderArgs<Info>;
    export type ActionArgs = T.CreateServerActionArgs<Info>;
    export type ClientActionArgs = T.CreateClientActionArgs<Info>;

    export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Info>;
    export type ComponentProps = T.CreateComponentProps<Info>;
    export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Info>;
  }
}