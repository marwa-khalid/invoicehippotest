import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import ReactQuill from "react-quill";
import clsx from "clsx";
import { DigitalSignature } from "./DigitalSignature";

type Props = { setActiveTab: any; tabs: any };

const QuoteValidateStep4 = () => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="modal-body py-10 px-20 ">
      <div className="row pb-lg-10">
        <DigitalSignature />
      </div>
    </div>
  );
};

export { QuoteValidateStep4 };
