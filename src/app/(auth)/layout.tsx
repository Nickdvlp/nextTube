interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="flex items-center justify-center">{children}</div>;
};

export default Layout;
