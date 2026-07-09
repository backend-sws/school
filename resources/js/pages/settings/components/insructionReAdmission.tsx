import HeadingSmall from "@/components/heading-small";
import RichTextEditor from "@/components/richTextEditor";
import { Button } from "@/components/ui/button";
import React from "react";

const InstructionReAdmission = () => {
  return (
    <div>
      <HeadingSmall
        title="Instruction for New Admission"
        // description="Update your site settings"
      />
      <RichTextEditor value="Write instruction for new admission" />
      <div className="pt-4">
        <Button>✔ Save</Button>
      </div>
    </div>
  );
};

export default InstructionReAdmission;
