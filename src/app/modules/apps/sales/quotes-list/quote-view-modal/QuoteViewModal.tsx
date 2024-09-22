import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

interface Props {
  downloadUrl: string;
  quoteNumber: string;
}

const QuoteViewModal = ({ downloadUrl, quoteNumber }: Props) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const webViewerInstance = useRef<any>(null);

  useEffect(() => {
    // Initialize WebViewer once
    if (viewerRef.current && !webViewerInstance.current) {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "demo:1727027175688:7e3c2b5a0300000000e2ace17fb21daa1d7c98d6e315ef1f9db3222e8f",
          disabledElements: ["header"],
        },
        viewerRef.current
      ).then((instance) => {
        webViewerInstance.current = instance;

        // Load the initial document
        if (downloadUrl) {
          instance.UI.loadDocument(downloadUrl);
          instance.Core.documentViewer.addEventListener(
            "documentLoaded",
            () => {
              instance.UI.setZoomLevel(1.5); // Set the zoom after the document is loaded
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
          webViewerInstance.current.UI.setZoomLevel(1.5); // Set the zoom after the document is loaded
        }
      );
    }

    // Cleanup on component unmount (optional)
    return () => {
      webViewerInstance.current?.UI?.closeDocument(); // Close the current document
      // Do not dispose the instance, just reset the reference
    };
  }, [downloadUrl]);
  return (
    <div
      className="offcanvas offcanvas-end w-50"
      tabIndex={-1}
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
      data-bs-backdrop="false"
    >
      <div className="offcanvas-header pb-1 pt-1 bg-primary d-flex justify-content-between align-items-center">
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
      </div>
      <div className="offcanvas-body p-0">
        <div
          ref={viewerRef}
          style={{ height: "90vh", width: "100%" }} // Full space
        ></div>
      </div>
    </div>
  );
};

export { QuoteViewModal };
