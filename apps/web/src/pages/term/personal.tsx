import type { NextPage } from "next";

import { privacyPolicySections } from "@/widgets/legal/model/legal-documents";
import { LegalDocumentPage } from "@/widgets/legal/ui/LegalDocumentPage";

const PersonalTermPage: NextPage & { noChrome?: boolean } = () => {
  return (
    <LegalDocumentPage
      title="개인정보처리방침"
      description="요양이의 개인정보 수집, 이용 목적, 보유 기간, 제3자 제공 및 보호 조치에 대한 안내입니다."
      effectiveDate="2026년 1월 1일"
      sections={privacyPolicySections}
    />
  );
};

PersonalTermPage.noChrome = true;

export default PersonalTermPage;
