import { FC } from "react";
import { useIntl } from "react-intl";
import { useFormikContext } from "formik";
import { useListView } from "../core/ListViewProvider";

const UserEditModalFooter: FC = () => {

  // For localization support
  const intl = useIntl();

//   // Accessing Formik's context
//   const { submitForm, isSubmitting, isValid, touched, resetForm } =
//     useFormikContext<any>();

  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      

      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
        //   onClick={() => resetForm()}
          className="btn btn-light me-3"
        //   disabled={isSubmitting}
        >
          {intl.formatMessage({ id: "Fields.ActionCancel" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-primary"
        //   onClick={submitForm}
        //   disabled={!isValid || isSubmitting || !touched}
        >
          <span className="indicator-label">
            {intl.formatMessage({ id: "Fields.ActionSave" })}
          </span>
          {/* {isSubmitting && ( */}
            <span className="indicator-progress">
              {intl.formatMessage({ id: "Common.Busy" })}...{" "}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          {/* )} */}
        </button>
      </div>
    </div>
  );
};

export { UserEditModalFooter };
