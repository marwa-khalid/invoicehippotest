import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer"; // Updated import
const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;

interface Props {
  downloadUrl: string;
  fileExtension: any;
}

const QuoteViewModal = ({ downloadUrl, fileExtension }: Props) => {
  const viewer = useRef(null);
  const webViewerInstance = useRef<any>(null);
  console.log(fileExtension);
  useEffect(() => {
    // Initialize WebViewer once
    if (viewer.current && !webViewerInstance.current) {
      WebViewer.WebComponent(
        {
          path: "/WebViewer/lib", // Adjust this path as needed for your project structure
          licenseKey: VIEWER_LICENSE_KEY,

          ui: "beta",
          initialDoc: downloadUrl,
          fullAPI: true, // Add this to enable full API support, including image format
        },
        viewer.current
      ).then((instance) => {
        const { UI, Core } = instance;
        const { documentViewer } = instance.Core;
        webViewerInstance.current = instance;
        webViewerInstance.current.UI.disableAnnotations();
        webViewerInstance.current.UI.disableDownload();
        webViewerInstance.current.UI.disableFilePicker();

        webViewerInstance.current.UI.disableElements([
          "saveAsButton",
          "settingsButton",
        ]);

        // @ts-ignore comment.

        const mainMenu = new instance.UI.Components.MainMenu();

        // @ts-ignore comment.
        const errorModalCloseButton = new UI.Components.CustomButton({
          dataElement: "errorModalCloseButton",
          label: "close",
          title: "this is a close button",
          onClick: () => webViewerInstance.current.UI.closeDocument(),
          img: "/media/auth/bg1.jpg",
        });
        const topHeader =
          new webViewerInstance.current.UI.Components.ModularHeader({
            dataElement: "default-top-header",

            placement: "left",

            grow: 0,

            gap: 12,

            position: "start",

            justifyContent: "center",

            style: {},
            additionalItems: [errorModalCloseButton],

            items: [mainMenu],
            alwaysVisible: true,
          });

        instance.UI.setModularHeaders([topHeader]);

        // Load the initial document
        if (downloadUrl) {
          // ... previous code remains the same

          webViewerInstance.current.UI.loadDocument(downloadUrl, {
            extension: fileExtension.replace(".", ""),
            onError: function (e: any) {
              console.error("Failed to load document: ", e);
            },
          });

          // ... the rest of the component
          documentViewer.addEventListener("documentLoaded", () => {
            instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
          });
        }
      });
    } else if (webViewerInstance.current && downloadUrl) {
      // If instance already exists, load the new document
      webViewerInstance.current.UI.loadDocument(downloadUrl, {
        extension: fileExtension.replace(".", ""),
        onError: function (e: any) {
          console.error("Failed to load document: ", e);
        },
      });
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
      // Close the current document, reset reference but don't dispose instance
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
      {/* <button
        type="button"
        className="btn btn-outline-danger btn-close fs-3x position-absolute"
        style={{ top: "10px", right: "10px" }}
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        onClick={() => {
          webViewerInstance.current.UI.closeDocument();
          // Add any additional actions you want on close, like unmounting the component
        }}
      ></button> */}
      <div className="offcanvas-body p-0">
        <div
          className="viewer"
          id="viewer"
          ref={viewer}
          style={{ height: "100vh" }}
        ></div>
      </div>
    </div>
  );
};

export { QuoteViewModal };
