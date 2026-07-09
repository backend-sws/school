import LegalPageLayout from "@/layouts/legal-page-layout";

interface Props {
  content: string;
}

export default function TermsAndConditions({ content }: Props) {
  return <LegalPageLayout title="Terms & Conditions" content={content} />;
}
