import * as React from "react";
import { HeadFC, Link, PageProps, navigate } from "gatsby";
import useViewTransition from "./useViewTransition";
import "./styles.css";

const IndexPage: React.FC<PageProps> = () => {
  const startViewTransition = useViewTransition();

  const ChangePage = async () => {
    await startViewTransition();
    navigate("/page1");
  };

  return (
    <main>
      <h1 style={{ viewTransitionName: "header", contain: "layout" }}>
        Home Page
      </h1>
      <button onClick={() => ChangePage()}>Navigate to Page1</button>
    </main>
  );
};

export default IndexPage;
