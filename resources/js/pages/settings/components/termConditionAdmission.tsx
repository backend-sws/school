import HeadingSmall from "@/components/heading-small";
import RichTextEditor from "@/components/richTextEditor";
import { Button } from "@/components/ui/button";

const TermConditionAdmission = () => {
  return (
    <div>
      <HeadingSmall title="Instruction for Admission" />{" "}
      <RichTextEditor value="Write Terms & Condition for new admission" />
      <div className="pt-4">
        <Button>✔ Save</Button>
      </div>
    </div>
  );
};

export default TermConditionAdmission;
