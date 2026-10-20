import { Outlet } from "react-router";
import Header from "../components/header";
import PersistenceBanner from "../components/persistence-banner";

export default function RootLayout() {
  return (
    <div className="app">
      <Header />
      <PersistenceBanner />
      <Outlet />
    </div>
  );
}
