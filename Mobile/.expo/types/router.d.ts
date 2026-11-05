/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/GameInfo`; params?: Router.UnknownInputParams; } | { pathname: `/Index`; params?: Router.UnknownInputParams; } | { pathname: `/Library`; params?: Router.UnknownInputParams; } | { pathname: `/LogIn`; params?: Router.UnknownInputParams; } | { pathname: `/SearchResults`; params?: Router.UnknownInputParams; } | { pathname: `/SignUp`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/GameInfo`; params?: Router.UnknownOutputParams; } | { pathname: `/Index`; params?: Router.UnknownOutputParams; } | { pathname: `/Library`; params?: Router.UnknownOutputParams; } | { pathname: `/LogIn`; params?: Router.UnknownOutputParams; } | { pathname: `/SearchResults`; params?: Router.UnknownOutputParams; } | { pathname: `/SignUp`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/GameInfo${`?${string}` | `#${string}` | ''}` | `/Index${`?${string}` | `#${string}` | ''}` | `/Library${`?${string}` | `#${string}` | ''}` | `/LogIn${`?${string}` | `#${string}` | ''}` | `/SearchResults${`?${string}` | `#${string}` | ''}` | `/SignUp${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/GameInfo`; params?: Router.UnknownInputParams; } | { pathname: `/Index`; params?: Router.UnknownInputParams; } | { pathname: `/Library`; params?: Router.UnknownInputParams; } | { pathname: `/LogIn`; params?: Router.UnknownInputParams; } | { pathname: `/SearchResults`; params?: Router.UnknownInputParams; } | { pathname: `/SignUp`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
