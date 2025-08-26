import { useEffect, useRef, useState } from "react";
import { ListLoading } from "./ListLoading";
import { KTIcon } from "../../../_metronic/helpers";
const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;

interface Props {
  downloadUrl: string;
  keyy: number;
}

const ViewCanvas = ({ downloadUrl, keyy }: Props) => {
  const { BASE_URL } = import.meta.env;
  const containerRef = useRef<HTMLDivElement>(null);
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const pspdfkitInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (downloadUrl) {
      setIsLoading(true);
      const container = containerRef.current;
      if (!container) return;
      let PSPDFKit: any;

      (async function () {
        try {
          PSPDFKit = await import("pspdfkit");
          // Unload previous instance if it exists
          PSPDFKit.unload(container);

          await PSPDFKit.load({
            licenseKey: VIEWER_LICENSE_KEY,
            container,
            toolbarItems: PSPDFKit.defaultToolbarItems.filter(
              (item: any) =>
                item.type !== "document-editor" && item.type !== "document-crop"
            ),
            document: downloadUrl,
            baseUrl: `${window.location.protocol}//${window.location.host}/${BASE_URL}`,
          });

          // Ensure offcanvas is shown
          offcanvasRef.current?.classList.add("show");
        } finally {
          setIsLoading(false);
        }
      })();

      return () => {
        PSPDFKit?.unload(container);
      };
    }
  }, [keyy, downloadUrl]); // Re-run when `downloadUrl` changes or `key` updates

  useEffect(() => {
    const offcanvas = offcanvasRef.current;
    if (!offcanvas) return;

    let startX = 0;
    let startWidth = 0;

    const handle = document.createElement("div");
    handle.style.position = "absolute";
    handle.style.top = "50%";
    handle.style.left = "-33px"; // Stick outside the left edge
    handle.style.transform = "translateY(-50%)"; // Center vertically
    handle.style.zIndex = "1050";
    handle.style.background = "#e0e0e0";
    handle.style.borderRadius = "6px 0px 0px 6px ";
    handle.style.padding = "30px 8px";
    handle.style.cursor = "col-resize";
    handle.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";
    handle.innerHTML = `<i class="bi bi-grip-vertical fs-3 text-dark"></i>`; // Bootstrap icon

    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX = e.clientX;
      startWidth = offcanvas.offsetWidth;

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });

    const resize = (e: MouseEvent) => {
      const newWidth = startWidth + (startX - e.clientX);
      if (newWidth > 300 && newWidth < window.innerWidth - 50) {
        offcanvas.style.width = `${newWidth}px`;
        pspdfkitInstance.current?.requestResize();
      }
    };

    const stopResize = () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    offcanvas.appendChild(handle);

    return () => {
      handle.remove();
    };
  }, []);

  return (
    <>
      <div
        className="offcanvas offcanvas-end"
        ref={offcanvasRef}
        tabIndex={1}
        id="offcanvasRight"
        data-bs-backdrop="false"
        style={{
          width: "50vw",
          transition: "width 0.2s ease",
          overflow: "visible",
        }}
      >
        {/* Close Button outside the viewer (top-left of offcanvas) */}
        <button
          onClick={() => {
            const unload = async () => {
              const PSPDFKitModule = await import("pspdfkit");
              const PSPDFKit = PSPDFKitModule.default;
              PSPDFKit.unload(containerRef.current);
            };
            unload();
            offcanvasRef.current?.classList.remove("show");
          }}
          style={{
            position: "absolute",
            left: "-33px", // Make sure it stays visible inside the offcanvas
            zIndex: 1050,
            background: "#f44336",
            borderRadius: "0px 0px 0px 4px",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          <KTIcon iconName="cross" className="text-white" />
        </button>

        <div className="offcanvas-body position-relative p-0">
          <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
        </div>
      </div>
      {isLoading && <ListLoading />}
    </>
  );
};

export { ViewCanvas };
