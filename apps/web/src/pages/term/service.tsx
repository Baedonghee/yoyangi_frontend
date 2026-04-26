import type { NextPage } from "next";

import { placeholderConfigs } from "@/shared/placeholder/config";
import { PlaceholderPage } from "@/shared/placeholder/PlaceholderPage";

const ServiceTermPage: NextPage & { noChrome?: boolean } = () => {
  return <PlaceholderPage config={placeholderConfigs.terms} />;
};

ServiceTermPage.noChrome = true;

export default ServiceTermPage;

