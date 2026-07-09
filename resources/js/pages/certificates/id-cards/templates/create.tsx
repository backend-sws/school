import TemplateForm from "./form";
import { ID_CARD_TEMPLATE_CREATE_BREADCRUMBS } from "@/constants/page/idCard";

const CreateTemplate = () => (
    <TemplateForm mode="create" breadcrumbs={ID_CARD_TEMPLATE_CREATE_BREADCRUMBS} />
);

CreateTemplate.layoutProps = {
    backHref: "/certificates/id-cards/templates",
    backLabel: "Back to Templates",
};

export default CreateTemplate;
