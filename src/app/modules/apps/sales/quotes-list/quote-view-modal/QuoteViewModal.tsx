import { useEffect, useRef } from "react";
import WebViewer, { WebViewerInstance } from "@pdftron/webviewer"; // Import WebViewerInstance type

interface Props {
  downloadUrl: string;
  quoteNumber: string;
}

const QuoteViewModal = ({ downloadUrl, quoteNumber }: Props) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const webViewerInstance = useRef<WebViewerInstance | null>(null);

  // Initialize WebViewer when the component is mounted
  useEffect(() => {
    if (downloadUrl && viewerRef.current) {
      WebViewer(
        {
          path: "/webviewer/lib", // Path to the WebViewer library assets
          initialDoc: downloadUrl, // URL of the PDF document
        },
        viewerRef.current
      ).then((instance) => {
        webViewerInstance.current = instance; // Store the WebViewer instance
      });
    }

    // Cleanup function: No need to manually dispose WebViewerInstance
    return () => {
      webViewerInstance.current = null; // Just reset the reference to null
    };
  }, [downloadUrl]);
  console.log(downloadUrl);
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
          style={{ height: "100vh" }} // Make sure it takes the full space of the offcanvas
        ></div>
      </div>
    </div>
  );
};

export { QuoteViewModal };
