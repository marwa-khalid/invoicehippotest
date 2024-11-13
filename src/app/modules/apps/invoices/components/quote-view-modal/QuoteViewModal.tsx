import { useEffect, useRef } from "react";
// import WebViewer from "@pdftron/webviewer"; // Updated import
// import { KTSVG } from "../../../../../../_metronic/helpers/index.js";
// const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;

interface Props {
  downloadUrl: string;
  fileExtension: any;
}

const QuoteViewModal = ({ downloadUrl, fileExtension }: Props) => {
  // const viewer = useRef(null);
  // const webViewerInstance = useRef<any>(null);
  const { BASE_URL } = import.meta.env;
  // useEffect(() => {
  //   // Initialize WebViewer once
  //   if (downloadUrl != "") {
  //     if (viewer.current && !webViewerInstance.current) {
  //       WebViewer.WebComponent(
  //         {
  //           path: "/WebViewer/lib", // Adjust this path as needed for your project structure
  //           licenseKey: VIEWER_LICENSE_KEY,
  //           ui: "beta",
  //           initialDoc: downloadUrl,
  //           fullAPI: true, // Add this to enable full API support, including image format
  //         },
  //         viewer.current
  //       ).then((instance) => {
  //         const { UI, Core } = instance;
  //         const { documentViewer } = instance.Core;
  //         webViewerInstance.current = instance;
  //         webViewerInstance.current.UI.disableAnnotations();
  //         webViewerInstance.current.UI.disableDownload();
  //         webViewerInstance.current.UI.disableFilePicker();

  //         webViewerInstance.current.UI.disableElements([
  //           "saveAsButton",
  //           "settingsButton",
  //         ]);

  //         // @ts-ignore comment.

  //         const mainMenu = new instance.UI.Components.MainMenu();

  //         // @ts-ignore comment.
  //         const errorModalCloseButton = new instance.UI.Components.CustomButton(
  //           {
  //             dataElement: "errorModalCloseButton",
  //             label: "close",
  //             title: "this is a close button",
  //             onClick: () => webViewerInstance.current.UI.closeDocument(),
  //             img: "/media/auth/bg1.jpg",
  //           }
  //         );
  //         const topHeader =
  //           new webViewerInstance.current.UI.Components.ModularHeader({
  //             dataElement: "default-top-header",

  //             placement: "left",

  //             grow: 0,

  //             gap: 12,

  //             position: "start",

  //             justifyContent: "center",

  //             style: {},
  //             additionalItems: [errorModalCloseButton],

  //             items: [mainMenu],
  //             alwaysVisible: true,
  //           });

  //         instance.UI.setModularHeaders([topHeader]);

  //         // Load the initial document
  //         if (downloadUrl) {
  //           // ... previous code remains the same

  //           webViewerInstance.current.UI.loadDocument(downloadUrl, {
  //             extension: fileExtension.replace(".", ""),
  //             onError: function (e: any) {
  //               console.error("Failed to load document: ", e);
  //             },
  //           });

  //           // ... the rest of the component
  //           documentViewer.addEventListener("documentLoaded", () => {
  //             instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
  //           });
  //         }
  //       });
  //     } else if (webViewerInstance.current && downloadUrl) {
  //       // If instance already exists, load the new document
  //       webViewerInstance.current.UI.loadDocument(downloadUrl, {
  //         extension: fileExtension.replace(".", ""),
  //         onError: function (e: any) {
  //           console.error("Failed to load document: ", e);
  //         },
  //       });
  //       webViewerInstance.current.Core.documentViewer.addEventListener(
  //         "documentLoaded",
  //         () => {
  //           webViewerInstance.current.UI.setFitMode(
  //             webViewerInstance.current.UI.FitMode.FitWidth
  //           );
  //         }
  //       );
  //     }
  //   }

  //   // Cleanup on component unmount (optional)
  //   return () => {
  //     webViewerInstance.current?.UI?.closeDocument();
  //     // Close the current document, reset reference but don't dispose instance
  //   };
  // }, [downloadUrl]);

  const containerRef = useRef<HTMLDivElement>(null);
  const offcanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (downloadUrl) {
      const container = containerRef.current; // This `useRef` instance will render the PDF.

      let PSPDFKit: any, instance: any;

      (async function () {
        PSPDFKit = await import("pspdfkit");

        PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.
        const toolbarItems = PSPDFKit.defaultToolbarItems;

        // toolbarItems.push({
        //   type: "spacer",
        // });

        // A custom item. Inside the onPress callback we can call into PSPDFKit APIs.
        toolbarItems.push({
          type: "custom",
          id: "my-custom-button",
          title: "X",
          onPress: function () {
            PSPDFKit.unload(container);
            offcanvasRef.current?.classList.remove("show"); // Close offcanvas
          },
        });

        instance = await PSPDFKit.load({
          // Container where PSPDFKit should be mounted.
          container,
          toolbarItems: toolbarItems,
          document: downloadUrl,
          baseUrl: `${window.location.protocol}//${window.location.host}/${BASE_URL}`,
        });
      })();

      return () => PSPDFKit && PSPDFKit.unload(container);
    }
  }, [downloadUrl]);

  // This div element will render the document to the DOM.
  return (
    <div
      className="offcanvas offcanvas-end w-50"
      ref={offcanvasRef}
      tabIndex={1}
      id="offcanvasRight"
      aria-labelledby="offcanvasRightLabel"
      data-bs-backdrop="false"
    >
      <div className="offcanvas-body">
        <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
      </div>
    </div>
  );
};

//   return (
//     <div
//       className="offcanvas offcanvas-end w-50"
//       tabIndex={1}
//       id="offcanvasRight"
//       aria-labelledby="offcanvasRightLabel"
//       data-bs-backdrop="false"
//     >
//       {/* <button
//         type="button"
//         className="btn btn-outline-danger btn-close fs-3x position-absolute"
//         style={{ top: "10px", right: "10px" }}
//         data-bs-dismiss="offcanvas"
//         aria-label="Close"
//         onClick={() => {
//           webViewerInstance.current.UI.closeDocument();
//           // Add any additional actions you want on close, like unmounting the component
//         }}
//       ></button> */}
//       <div className="offcanvas-body p-0">
//         {/* <div
//           className="viewer"
//           id="viewer"
//           ref={viewer}
//           style={{ height: "100vh" }}
//         ></div> */}
//         <div id="pspdfkit" style={{ width: "100%", height: "100vh" }}></div>
//       </div>
//     </div>
//   );
// };

export { QuoteViewModal };
