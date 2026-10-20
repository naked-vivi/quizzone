import { Outlet } from "react-router";
import Header from "./header";
import PersistenceBanner from "./persistence-banner";

export default function RootLayout() {
  return (
    <div className="app">
      <Header />
      <PersistenceBanner />
      <Outlet />
    </div>
  );
}
