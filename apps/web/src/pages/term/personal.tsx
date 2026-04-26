import type { NextPage } from "next";

import { placeholderConfigs } from "@/shared/placeholder/config";
import { PlaceholderPage } from "@/shared/placeholder/PlaceholderPage";

const PersonalTermPage: NextPage & { noChrome?: boolean } = () => {
  return <PlaceholderPage config={placeholderConfigs.privacy} />;
};

PersonalTermPage.noChrome = true;

export default PersonalTermPage;

