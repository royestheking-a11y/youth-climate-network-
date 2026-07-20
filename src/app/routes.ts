import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { OurWorkPage } from './components/OurWorkPage';
import { OurWorkDetailsPage } from './components/OurWorkDetailsPage';
import { ImpactPage } from './components/ImpactPage';
import { GetInvolvedPage } from './components/GetInvolvedPage';
import { DonatePage } from './components/DonatePage';
import { AdvocacyPage } from './components/AdvocacyPage';
import { MindShantaraPage } from './components/MindShantaraPage';
import { MediaPage } from './components/MediaPage';
import { ContactPage } from './components/ContactPage';
import { AdminPage } from './components/AdminPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { NotFoundPage } from './components/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'about', Component: AboutPage },
      { path: 'our-work', Component: OurWorkPage },
      { path: 'our-work/:id', Component: OurWorkDetailsPage },
      { path: 'impact', Component: ImpactPage },
      { path: 'get-involved', Component: GetInvolvedPage },
      { path: 'donate', Component: DonatePage },
      { path: 'our-work/mind-shantara', Component: MindShantaraPage },
      { path: 'our-work/advocacy', Component: AdvocacyPage },
      { path: 'media', Component: MediaPage },
      { path: 'contact', Component: ContactPage },
      { path: 'privacy', Component: PrivacyPage },
      { path: 'terms', Component: TermsPage },
      { path: 'admin', Component: AdminPage },
      { path: 'admin/:tab', Component: AdminPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
