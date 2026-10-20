import type { ComponentType } from "react";

type PageModule = { default: ComponentType };

export function lazyPage(importPage: () => Promise<PageModule>) {
  return async () => {
    const { default: Component } = await importPage();
    return { Component };
  };
}
