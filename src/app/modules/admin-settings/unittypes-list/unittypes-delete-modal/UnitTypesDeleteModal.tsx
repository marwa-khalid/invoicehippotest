import { useEffect} from "react";
import { UnitTypesDeleteModalHeader } from "./UnitTypesDeleteModalHeader";
import { UnitTypesDeleteModalFooter } from "./UnitTypesDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  unitTypeTitle: string;
  deleteModalId: any;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  refresh: boolean;
}
const UnitTypesDeleteModal = ({
  deleteModalId,
  unitTypeTitle,
  setDeleteModalOpen,
  setDeleteModalId,
  setRefresh,
  refresh,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <UnitTypesDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              setDeleteModalId={setDeleteModalId}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="form-wrapper">
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl
                      .formatMessage({
                        id: "Fields.ModalDeleteDescriptionUnitType",
                      })
                      .replace("{0}", unitTypeTitle),
                  }}
                />
              </div>
            </div>

            {/* end::Modal body */}
            <UnitTypesDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              setDeleteModalId={setDeleteModalId}
            />
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { UnitTypesDeleteModal };
