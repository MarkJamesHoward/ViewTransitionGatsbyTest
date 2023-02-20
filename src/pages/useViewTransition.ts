import { useRef, useLayoutEffect, useEffect } from "react";

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

interface Document {
  startViewTransition(setupPromise: () => Promise<void> | void): ViewTransition;
}

interface UseViewTransitionArg<DataType> {
  beforeChange?(data: DataType, transition: ViewTransition): void;
  afterChange?(data: DataType, transition: ViewTransition): void;
  done?(data: DataType): void;
}

interface StartTransitionOptions<DataType> {
  classNames?: string[];
  data?: DataType;
}

export default function useViewTransition<DataType = undefined>({
  beforeChange,
  afterChange,
  done,
}: UseViewTransitionArg<DataType> = {}) {
  const startResolverRef = useRef<(value?: unknown) => void>();
  const beforeChangeRef = useRef(beforeChange);
  const afterChangeRef = useRef(afterChange);
  const doneRef = useRef(done);
  const dataRef = useRef<DataType>();
  const transitionRef = useRef<ViewTransition>();

  useLayoutEffect(() => {
    if (startResolverRef.current === undefined) {
      console.log("not ready yet");
      return;
    }
    console.log("Running full useLayoutEffect");
    afterChangeRef.current?.(dataRef.current!, transitionRef.current!);
    startResolverRef.current(); // This calls Resolve for our promise
    startResolverRef.current = undefined; // Clear this so we don't call again
  });

  return async ({
    classNames = [],
    data,
  }: StartTransitionOptions<DataType> = {}): Promise<void> => {
    if (!("startViewTransition" in document)) return;

    return new Promise<void>((resolve) => {
      dataRef.current = data;
      document.documentElement.classList.add(...classNames);

      //@ts-ignore
      const transition = document.startViewTransition(async () => {
        resolve();
        // Wait for next update
        await new Promise((resolve) => (startResolverRef.current = resolve));
        console.log(
          "Document.StartViewTransition DOM update should be in place now"
        );
      });

      transitionRef.current = transition; // Holds the promise from startViewTransition
      beforeChangeRef.current?.(data!, transition);

      // Clean up any classes we added
      // Doneref - not sure what used for?
      transition.finished
        .finally(() => {
          document.documentElement.classList.remove(...classNames);
          doneRef.current?.(data!);
        })
        .catch(() => {});
    });
  };
}
