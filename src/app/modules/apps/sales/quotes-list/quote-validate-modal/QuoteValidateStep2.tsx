import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import ReactQuill from "react-quill";

type Props = { setActiveTab: any; tabs: any };

const QuoteValidateStep2 = () => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="modal-body py-10 px-20 ">
      <div className="row pb-lg-10">
        <ReactQuill
          theme="snow"
          placeholder="Jouw tekst hier..."
          style={{ height: "200px" }}
          // onChange={handleQuillChange1}
          // value={formik.values.comments.quoteComments}
        />
      </div>
    </div>
  );
};

export { QuoteValidateStep2 };
