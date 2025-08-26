import { FC, useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { deleteSubscriber } from "../../../core/_requests";
import { useNavigate } from "react-router";
import { handleToast } from "../../../../../auth/core/_toast";

interface props {
  isLoading: boolean;
  id: number;
}
const DeleteSubscriber: FC<props> = ({ isLoading, id }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [check, setCheck] = useState<boolean>(false);
  const deleteAccount = async () => {
    const res = await deleteSubscriber(id);
    handleToast(res);
    if (res.isValid) {
      navigate("/admin/subscribers");
    }
  };
  return (
    <div className="card mb-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_deactivate"
        aria-expanded="true"
        aria-controls="kt_account_deactivate"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">
            {intl.formatMessage({
              id: "Fields.TabDeleteAccount",
            })}
          </h3>
        </div>
      </div>

      <div id="kt_account_deactivate" className="collapse show">
        <div className="card-body border-top p-9">
          <div className="notice d-flex bg-light-danger rounded border-danger border border-dashed mb-9 p-6">
            <KTIcon
              iconName="information-5"
              className="fs-2tx text-danger me-4"
            />

            <div className="d-flex flex-stack flex-grow-1">
              <div className="fw-bold">
                <h4 className="text-gray-800 fw-bolder">
                  {intl.formatMessage({
                    id: "Fields.SubscriberDeleteAccountTitle",
                  })}
                </h4>
                <div className="fs-6 text-gray-600">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({
                        id: "Fields.SubscriberDeleteAccountDescription",
                      }),
                    }}
                  />
                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="form-check form-check-solid">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              id="confirm"
              checked={check}
              onChange={() => setCheck(!check)}
            />
            <label
              className="form-check-label fw-bold ps-2 fs-6"
              htmlFor="confirm"
            >
              {intl.formatMessage({
                id: "Fields.SubscriberDeleteAccountDeleteConfirmation",
              })}
            </label>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-end py-6 px-9">
          <button
            id="kt_account_deactivate_account_submit"
            type="submit"
            className="btn btn-danger fw-bold"
            disabled={!check}
            onClick={() => deleteAccount()}
          >
            {!isLoading && intl.formatMessage({ id: "Fields.ActionDelete" })}
            {isLoading && (
              <span className="indicator-progress" style={{ display: "block" }}>
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { DeleteSubscriber };
