import React, { JSX, PropsWithChildren } from "react";

/**
 * This is mostly meant for integration testing purposes,
 * where you have to create large/deep provider trees
 * to inject all the dependencies to each layer
 */
export const createProviderTree = (providers: JSX.Element[]) => {
  return function ProviderTree(props: PropsWithChildren) {
    const lastIndex = providers.length - 1;
    let children = props.children;

    for (let i = lastIndex; i >= 0; i--) {
      const element = providers[i];
      children = React.cloneElement(element, undefined, children);
    }

    return children;
  };
};
