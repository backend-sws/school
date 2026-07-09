import LegalPageLayout from "@/layouts/legal-page-layout";

interface Props {
  content: string;
}

export default function PrivacyPolicy({ content }: Props) {
  return <LegalPageLayout title="Privacy Policy" content={content} />;
}
