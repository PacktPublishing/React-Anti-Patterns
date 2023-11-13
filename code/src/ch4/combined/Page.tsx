import React from "react";

type HeaderProps = {
  title: string;
  subtitle: string;
  onClick: () => void;
};

const Header = ({ title, subtitle, onClick }: HeaderProps) => {
  return (
    <header onClick={onClick}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </header>
  );
};

type SidebarProps = {
  links: string[];
  onLinkClick: (link: string) => void;
};

const Sidebar = ({ links, onLinkClick }: SidebarProps) => {
  return (
    <aside>
      <ul>
        {links.map((link) => (
          <li key={link} onClick={() => onLinkClick(link)}>
            {link}
          </li>
        ))}
      </ul>
    </aside>
  );
};

type MainProps = {
  isLoading: boolean;
  content: React.ReactNode;
};

const Main = ({ isLoading, content }: MainProps) => {
  return <>{!isLoading && <main>{content}</main>}</>;
};

type PageProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
};

function Page({ header, sidebar, main }: PageProps) {
  return (
    <div>
      {header}
      {sidebar}
      {main}
    </div>
  );
}

export { Header, Sidebar, Main, Page };
