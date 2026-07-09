import TemplateForm from "./form";
import { ID_CARD_TEMPLATE_EDIT_BREADCRUMBS } from "@/constants/page/idCard";

const EditTemplate = ({ id }: { id: number }) => (
    <TemplateForm mode="edit" id={id} breadcrumbs={ID_CARD_TEMPLATE_EDIT_BREADCRUMBS} />
);

EditTemplate.layoutProps = {
    backHref: "/certificates/id-cards/templates",
    backLabel: "Back to Templates",
};

export default EditTemplate;
