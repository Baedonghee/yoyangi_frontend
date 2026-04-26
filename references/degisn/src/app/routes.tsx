import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Home } from "./components/Home";
import { SearchResults } from "./components/SearchResults";
import { Discover } from "./components/Discover";
import { Profile } from "./components/Profile";
import { FacilityDetail } from "./components/FacilityDetail";
import { Guide } from "./components/Guide";
import { GuideDetail } from "./components/GuideDetail";
import { Recommended } from "./components/Recommended";
import { Login } from "./components/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "search", Component: SearchResults },
      { path: "discover", Component: Discover },
      { path: "profile", Component: Profile },
      { path: "facility/:id", Component: FacilityDetail },
      { path: "guide", Component: Guide },
      { path: "guide/:id", Component: GuideDetail },
      { path: "recommended", Component: Recommended },
      { path: "login", Component: Login },
      { path: "*", Component: () => <div className="p-8 text-center text-slate-500 font-medium text-lg">페이지를 찾을 수 없습니다.</div> },
    ],
  },
]);