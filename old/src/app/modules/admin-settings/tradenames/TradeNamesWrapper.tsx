import { FormikProps } from "formik";
import { KTCardBody, KTIcon, KTSVG } from "../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { TradeNamesResult } from "../my-company/core/_models";
import { useEffect, useState } from "react";
import { getTradenames } from "../my-company/core/_requests";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useAuth } from "../../auth";
import { TradeNamesAddModal } from "./tradenames-add-modal/TradeNamesAddModal";
import { TradeNameDeleteModal } from "./tradename-delete-modal/TradeNameDeleteModal";
import { Outlet } from "react-router-dom";
import { TradeNamesToolbar } from "./components/TradeNamesToolbar";

interface Props {
  companyId?: number;
  setTradeNamesModalOpen: (type: boolean) => void;
  setTradeNameId: (type: number) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  refresh: boolean;
}

const TradeNamesWrapper = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const [activeCompanyId, setActiveCompanyId] = useState<number | undefined>(
    currentUser?.result.activeCompany.id
  );
  const [tradeNameId, setTradeNameId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [tradeNames, setTradeNames] = useState<TradeNamesResult[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTradeNames = async () => {
      try {
        const response = await getTradenames(activeCompanyId);
        if (response.isValid) {
          setTradeNames(response.result);
        }
      } catch (error) {}
    };
    fetchTradeNames();
  }, [refresh]);

  const handleEdit = (id: number) => {
    setTradeNameId(id);
    setAddModalOpen(true);
  };

  const handleDelete = (id: number, title: string) => {
    setDeleteModalOpen(true);
    setTradeNameId(id);
    setTitle(title);
  };

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <TradeNamesToolbar
          totalRows={tradeNames.length}
          setAddModalOpen={setAddModalOpen}
          setTradeNameId={setTradeNameId}
        />
        {addModalOpen && (
          <TradeNamesAddModal
            setRefresh={setRefresh}
            refresh={refresh}
            setAddModalOpen={setAddModalOpen}
            tradeNameId={tradeNameId}
            companyId={activeCompanyId || 0}
          />
        )}
        {deleteModalOpen && (
          <TradeNameDeleteModal
            deleteModalId={tradeNameId}
            title={title}
            setDeleteModalOpen={setDeleteModalOpen}
            setRefresh={setRefresh}
            refresh={refresh}
            setDeleteModalId={setTradeNameId}
          />
        )}
        {/* <div className="card">
          <div className="card-header border-bottom align-items-center">
            <h3 className="fw-bolder m-0">
              {intl.formatMessage({ id: "Settings.SideMenuTradeNames" })}
            </h3>
            <button className="btn btn-primary" onClick={handleAddNew}>
              {intl.formatMessage({ id: "Fields.ActionNew" })}
            </button>
          </div> */}

        <KTCardBody className="py-4">
          <div className="row g-3">
            {tradeNames.map((tradeName) => (
              <div key={tradeName.id}>
                <div className="card position-relative shadow-sm p-10">
                  <div className="mb-4">
                    {
                      tradeName.companyLogoUrl && (
                        <img
                          src={tradeName.companyLogoUrl}
                          alt=""
                          style={{
                            objectFit: "contain",
                            width: "100%",
                            maxWidth: "100px",
                            height: "auto",
                          }}
                        />
                      )
                      // : (
                      //   <KTSVG
                      //     className="svg-icon svg-icon-4x"
                      //     path="media/icons/hugeicons/image-upload.svg"
                      //   />
                      // )
                    }
                  </div>
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title mb-0">{tradeName.title}</h5>
                  </div>
                  <p
                    className="card-text text-muted mt-2"
                    dangerouslySetInnerHTML={{
                      __html: tradeName.addressAsHtml,
                    }}
                  />

                  {/* {tradeName.companyLogoUrl && (
                  <img
                    src={tradeName.companyLogoUrl}
                    alt="Company Logo"
                    className="img-fluid mt-3"
                  />
                )} */}

                  <div className="border-top text-end pt-4">
                    <span
                      className="text-primary cursor-pointer me-4"
                      onClick={() => handleEdit(tradeName.id)}
                    >
                      <KTIcon iconName="pencil" className="fs-1 text-warning" />
                    </span>
                    <span
                      className="text-danger cursor-pointer"
                      onClick={() =>
                        handleDelete(tradeName.id, tradeName.title)
                      }
                    >
                      <KTIcon iconName="trash" className="fs-1 text-danger" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </KTCardBody>
        {/* </div> */}
      </Content>
    </>
  );
};

export { TradeNamesWrapper };
