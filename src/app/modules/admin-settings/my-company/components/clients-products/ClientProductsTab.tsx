import { FormikProps } from "formik";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Clients } from "./Clients";
import { Products } from "./Products";
import { useState } from "react";
import { CustomTabManager } from "../../../../generic/Tabs/CustomTabManager";

interface Props {
  formik: FormikProps<any>;
  isSubmitting: boolean;
  setModalOpen: (type: boolean) => void;
}

const ClientProductsTab = ({ formik, isSubmitting, setModalOpen }: Props) => {
  const intl = useIntl();
  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({
        id: "Menu.HeaderCustomers",
      }),
      icon: "ki-solid ki-user fs-2 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({
        id: "Menu.Products",
      }),
      icon: "ki-solid ki-add-item fs-2 hippo-tab-icon",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered mw-700px">
          <div className="modal-content">
            <div className="modal-header bg-primary d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center w-100">
                <h3 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({
                    id: "Settings.SideMenuClientsAndProducts",
                  })}
                </h3>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={() => setModalOpen(false)}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
                </div>
              </div>
            </div>
            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              hasOptions={false}
              hasSubscriptions={false}
            />
            <div className="modal-body p-10">
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="clients_tab"
                  role="tabpanel"
                >
                  <Clients formik={formik} />
                </div>
                <div
                  className="tab-pane fade"
                  id="products_tab"
                  role="tabpanel"
                >
                  <Products formik={formik} />
                </div>
              </div>
            </div>

            <div className="modal-footer flex-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !formik.isValid}
                onClick={() => formik.handleSubmit()}
              >
                {!isSubmitting &&
                  intl.formatMessage({ id: "Fields.ActionSave" })}
                {isSubmitting && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({ id: "Common.Busy" }),
                      }}
                    />
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};
export { ClientProductsTab };
