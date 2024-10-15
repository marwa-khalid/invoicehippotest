import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";
const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;
interface Props {
  downloadUrl: string;
}

const QuoteViewModal = ({ downloadUrl }: Props) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const webViewerInstance = useRef<any>(null);

  useEffect(() => {
    // Initialize WebViewer once
    if (viewerRef.current && !webViewerInstance.current) {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey: VIEWER_LICENSE_KEY,
          // disabledElements: ["header"],
        },
        viewerRef.current
      ).then((instance) => {
        webViewerInstance.current = instance;
        webViewerInstance.current.UI.disableAnnotations();
        webViewerInstance.current.UI.disableDownload();
        webViewerInstance.current.UI.disableFilePicker();
        webViewerInstance.current.UI.disableElements([
          "saveAsButton",
          "settingsButton",
          "createPortfolioButton",
        ]);

        // Load the initial document
        if (downloadUrl) {
          instance.UI.loadDocument(downloadUrl);
          instance.Core.documentViewer.addEventListener(
            "documentLoaded",
            () => {
              instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
            }
          );
        }
      });
    } else if (webViewerInstance.current && downloadUrl) {
      // If instance already exists, load the new document

      webViewerInstance.current.UI.loadDocument(downloadUrl);
      webViewerInstance.current.Core.documentViewer.addEventListener(
        "documentLoaded",
        () => {
          webViewerInstance.current.UI.setFitMode(
            webViewerInstance.current.UI.FitMode.FitWidth
          );
        }
      );
    }

    // Cleanup on component unmount (optional)
    return () => {
      webViewerInstance.current?.UI?.closeDocument();
      // Close the current document
      // Do not dispose the instance, just reset the reference
    };
  }, [downloadUrl]);
  return (
    <div
      className="offcanvas offcanvas-end w-50"
      tabIndex={1}
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
      data-bs-backdrop="false"
    >
      {/* <div className="offcanvas-header pb-1 pt-1 bg-primary d-flex justify-content-between align-items-center">
        <h5 className="text-white mt-3" id="offcanvasRightLabel">
          {quoteNumber || "Quote Document"}
        </h5>
        <button
          type="button"
          className="btn btn-active-primary btn-color-white fs-2"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          x
        </button>
      </div> */}
      {/* <div
        className="ribbon ribbon-start ribbon-clip position-absolute"
        style={{
          top: "30px",
          height: "30px",
          width: "100px",
          transform: "translateX(-50%) rotate(-90deg)",
        }}
      >
        <div className="ribbon-label fw-bold">
          {quoteNumber}
          <span className="ribbon-inner bg-gray-600"></span>
        </div>
      </div> */}

      <button
        type="button"
        className="btn btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger btn-close fs-3x position-absolute"
        style={{
          top: "10px",
          left: "88%",
        }}
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>

      <div className="offcanvas-body p-0">
        <div
          ref={viewerRef}
          style={{ height: "100vh", width: "100%" }} // Full space
        ></div>
      </div>
    </div>
  );
};

export { QuoteViewModal };
