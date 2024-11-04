import { useEffect, useRef, useState } from "react";
import { Content } from "../../../../../_metronic/layout/components/content";
import { ListLoading } from "../../components/ListLoading";
import Tippy from "@tippyjs/react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../_metronic/helpers";
import { QuoteAddModal } from "./quote-add-modal/QuoteAddModal";
import { QuoteValidateModal } from "./quote-validate-modal/QuoteValidateModal";

const QuoteViewWrapper = () => {
  const { BASE_URL } = import.meta.env;
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [validateModalOpen, setValidateModalOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [editModalId, setEditModalId] = useState<number>(0);
  const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);
  const valueSetter = () => {
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        quoteDateAsString: currentQuote?.quoteDateAsString,
        client: currentQuote?.client,
        totalPriceWithVat: currentQuote?.totals.totalPriceWithVAT,
        sign: currentQuote?.valuta.sign,
        status: currentQuote?.quoteStatus.value,
        attachmentsCount: currentQuote?.attachmentsCount,
      })
    );
  };
  console.log(currentQuote);
  useEffect(() => {
    setIsLoading(true);

    if (currentQuote?.downloadInfo.downloadUrl) {
      const container = containerRef.current; // This `useRef` instance will render the PDF.

      let PSPDFKit: any, instance: any;

      (async function () {
        container?.requestFullscreen();

        PSPDFKit = await import("pspdfkit");

        PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.
        const initialViewState = new PSPDFKit.ViewState({
          layoutMode: PSPDFKit.LayoutMode.DOUBLE,
        });
        instance = await PSPDFKit.load({
          // Container where PSPDFKit should be mounted.
          container,
          initialViewState: new PSPDFKit.ViewState({
            zoom: 1.5,
          }),
          document: currentQuote.downloadInfo.downloadUrl,
          baseUrl: `${window.location.protocol}//${window.location.host}/${BASE_URL}`,
        });
        instance.setViewState((viewState: any) =>
          viewState.set("showToolbar", !viewState.showToolbar)
        );

        setIsLoading(false);
      })();

      return () => PSPDFKit && PSPDFKit.unload(container);
    }
  }, []);

  // This div element will render the document to the DOM.
  return (
    <div>
      <div className="text-end">
        {currentQuote?.actions.canApprove && (
          <Tippy content="Approve/Disapprove">
            <button
              type="button"
              className="btn btn-success btn-sm mb-3 me-7"
              onClick={() => {
                valueSetter();
                setValidateModalOpen(true);
              }}
            >
              <i className="fa far fa-credit-card me-2 fs-1"></i>
              {intl.formatMessage({
                id: "Fields.ActionApprove",
              })}
            </button>
          </Tippy>
        )}
        <Tippy
          content={intl.formatMessage({
            id: "Fields.ToolTipNew",
          })}
        >
          <button
            type="button"
            className="btn btn-primary btn-sm mb-3"
            onClick={() => setAddModalOpen(true)}
          >
            <KTIcon iconName="plus" className="fs-1" />
            {intl.formatMessage({ id: "Fields.ActionNew" })}
          </button>
        </Tippy>
      </div>
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100vh", overflow: "hidden" }}
      />
      {/* {isLoading && <ListLoading />} */}
      {addModalOpen && (
        <QuoteAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
        />
      )}
      {validateModalOpen && (
        <QuoteValidateModal
          quoteId={currentQuote?.id}
          quoteNumber={currentQuote?.quoteNr}
          setValidateModalOpen={setValidateModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export { QuoteViewWrapper };
