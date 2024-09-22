import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

interface Props {
  downloadUrl: string;
  quoteNumber: string;
}

const QuoteViewModal = ({ downloadUrl, quoteNumber }: Props) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  // Initialize WebViewer when the component is mounted
  useEffect(() => {
    if (downloadUrl && viewerRef.current) {
      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "demo:1727027175688:7e3c2b5a0300000000e2ace17fb21daa1d7c98d6e315ef1f9db3222e8f",
        },
        viewerRef.current // Use the ref here
      ).then((instance) => {
        const { UI, Core } = instance;
        const { documentViewer } = Core;

        documentViewer.addEventListener("documentLoaded", () => {
          // Additional document-related methods can be called here
        });

        instance.UI.loadDocument(downloadUrl);
      });
    }
  }, [downloadUrl]); // Run effect when downloadUrl changes

  return (
    <div
      className="offcanvas offcanvas-end w-50"
      tabIndex={-1}
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
      data-bs-backdrop="false"
    >
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel">{quoteNumber || "Quote Document"}</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        {/* WebViewer will be rendered inside this div */}
        <div
          ref={viewerRef}
          style={{ height: "100vh", width: "100%" }} // Ensure full space usage
        ></div>
      </div>
    </div>
  );
};

export { QuoteViewModal };
