import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminAdd from 'pages/Admin/Add';
import AdminList from 'pages/Admin/List';
import BannerAdd from 'pages/Banner/Add';
import BannerList from 'pages/Banner/List';
import CareAdd from 'pages/Care/Add';
import CareList from 'pages/Care/List';
import Dashboard from 'pages/Dashboard';
import Login from 'pages/Login';
import MemberList from 'pages/Member/List';
import NotFound from 'pages/NotFound';
import PremiumAdd from 'pages/Premium/Add';
import PremiumList from 'pages/Premium/List';
import ReviewList from 'pages/Review/List';
import YoutubeAdd from 'pages/Youtube/Add';
import YoutubeList from 'pages/Youtube/List';
import { PATH } from 'utils/path';

import Layout from 'components/common/Layout';

import GuardRoute from './GuardRoute';
import ProtectedRoute from './ProtectedRoute';

const pageRoutes: React.FC = () => (
  <Routes>
    <Route path={PATH.LOGIN} element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path={PATH.MAIN} element={<Dashboard />} />
        <Route element={<GuardRoute code="A1" />}>
          <Route path={PATH.MEMBER_LIST} element={<MemberList />} />
        </Route>
        <Route element={<GuardRoute code="A2" />}>
          <Route path={PATH.CARE_LIST} element={<CareList />} />
          <Route path={PATH.CARE_ADD} element={<CareAdd />} />
          <Route path={PATH.CARE_EDIT} element={<CareAdd />} />
        </Route>
        <Route element={<GuardRoute code="A3" />}>
          <Route path={PATH.PREMIUM_LIST} element={<PremiumList />} />
          <Route path={PATH.PREMIUM_ADD} element={<PremiumAdd />} />
          <Route path={PATH.PREMIUM_EDIT} element={<PremiumAdd />} />
        </Route>
        <Route element={<GuardRoute code="A4" />}>
          <Route path={PATH.BANNER_LIST} element={<BannerList />} />
          <Route path={PATH.BANNER_ADD} element={<BannerAdd />} />
          <Route path={PATH.BANNER_EDIT} element={<BannerAdd />} />
        </Route>
        <Route element={<GuardRoute code="A5" />}>
          <Route path={PATH.YOUTUBE_LIST} element={<YoutubeList />} />
          <Route path={PATH.YOUTUBE_ADD} element={<YoutubeAdd />} />
          <Route path={PATH.YOUTUBE_EDIT} element={<YoutubeAdd />} />
        </Route>
        <Route element={<GuardRoute code="A6" />}>
          <Route path={PATH.ADMIN_LIST} element={<AdminList />} />
          <Route path={PATH.ADMIN_ADD} element={<AdminAdd />} />
          <Route path={PATH.ADMIN_EDIT} element={<AdminAdd />} />
        </Route>
        <Route path={PATH.REVIEW_LIST} element={<ReviewList />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default pageRoutes;
