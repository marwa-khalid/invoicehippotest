import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";

import { KTSVG } from "../../../../../../_metronic/helpers";
type Props = { setMode: (type: number) => void; mode: number };

const QuoteValidateStep1 = ({ mode, setMode }: Props) => {
  const intl = useIntl();

  return (
    <div className="modal-body py-10 px-20 ">
      <div className="pb-lg-10">
        <h2 className="fw-bolder d-flex align-items-center text-gray-900">
          Make a choice
          <Tippy content="Estimation approval or decline is based on your choice">
            <i className="fas fa-exclamation-circle ms-2 fs-7 cursor-pointer"></i>
          </Tippy>
        </h2>

        <div className="text-gray-500 fw-bold fs-6">
          Choose one of the options to either approve or decline the estimation.
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <input
            type="radio"
            className="btn-check"
            name="accountType"
            value="approve"
            id="kt_create_account_form_account_type_personal"
            onChange={() => setMode(1)}
            checked={mode === 1}
          />
          <label
            className="btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10"
            htmlFor="kt_create_account_form_account_type_personal"
          >
            <KTSVG
              path="media/svg/general/approve-2.svg"
              className="svg-icon-3x me-5"
            />

            <span className="d-block fw-bold text-start">
              <span className="text-gray-900 fw-bolder d-block fs-4 mb-2">
                Approve
              </span>
              <span className="text-gray-500 fw-bold fs-6">
                If you need more info, please check it out
              </span>
            </span>
          </label>
        </div>

        <div className="col-lg-6">
          <input
            type="radio"
            className="btn-check"
            name="accountType"
            value="decline"
            id="kt_create_account_form_account_type_corporate"
            onChange={() => setMode(2)}
            checked={mode === 2}
          />
          <label
            className="btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center "
            htmlFor="kt_create_account_form_account_type_corporate"
          >
            <KTSVG
              path="media/svg/general/reject.svg"
              className="svg-icon-3x me-5"
            />

            <span className="d-block fw-bold text-start">
              <span className="text-gray-900 fw-bolder d-block fs-4 mb-2">
                Decline
              </span>
              <span className="text-gray-500 fw-bold fs-6">
                Create corporate account to manage users
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export { QuoteValidateStep1 };
