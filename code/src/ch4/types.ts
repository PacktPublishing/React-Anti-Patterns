type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
};

type PageProps = {
  title: string;
  subtitle: string;
  sidebarLinks: string[];
  onToggleHeader: () => void;
  onToggleSidebar: () => void;
};

export { type Product, type PageProps };
