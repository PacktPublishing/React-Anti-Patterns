import { PageProps } from "../types";
import { PageContext } from "./PageContext";

type PageProviderProps = {
  config: PageProps;
  children: React.ReactNode;
};

function PageProvider({ config, children }: PageProviderProps) {
  return <PageContext.Provider value={config}>{children}</PageContext.Provider>;
}

export default PageProvider;
