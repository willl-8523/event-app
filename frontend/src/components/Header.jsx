import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
  // React app is fetching anywhere in the application (0 to not and 1 to yes)
  const fetching = useIsFetching();

  return (
    <>
      <div id="main-header-loading">
        {/* <progress /> html element */}
        {fetching > 0 && <progress />}
      </div>
      <header id="main-header">
        <div id="header-title">
          <h1>Events App</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
