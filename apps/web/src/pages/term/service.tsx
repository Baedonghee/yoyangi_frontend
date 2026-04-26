import type { NextPage } from "next";

import { termsOfServiceSections } from "@/widgets/legal/model/legal-documents";
import { LegalDocumentPage } from "@/widgets/legal/ui/LegalDocumentPage";

const ServiceTermPage: NextPage & { noChrome?: boolean } = () => {
  return (
    <LegalDocumentPage
      title="이용약관"
      description="요양이 서비스 이용 시 필요한 규정, 권리, 의무 및 책임 사항에 대한 안내입니다."
      effectiveDate="2026년 1월 1일"
      sections={termsOfServiceSections}
    />
  );
};

ServiceTermPage.noChrome = true;

export default ServiceTermPage;
