import * as React from "react";
import { PageProps, navigate } from "gatsby";
import useViewTransition from "./useViewTransition";

const IndexPage: React.FC<PageProps> = () => {
  const startViewTransition = useViewTransition();

  const ChangePage = async () => {
    await startViewTransition();
    navigate("/");
  };

  return (
    <main>
      <h1 style={{ viewTransitionName: "header", contain: "layout" }}>Page1</h1>
      <button onClick={() => ChangePage()}>Home</button>
    </main>
  );
};

export default IndexPage;
