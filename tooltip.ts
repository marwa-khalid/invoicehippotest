// import { useEffect } from "react";
// import { Tooltip } from "bootstrap";
// import { useLocation } from "react-router-dom";

// export function useBootstrapTooltips() {
//   const location = useLocation();

//   useEffect(() => {
//     const tooltipTriggerList = Array.from(
//       document.querySelectorAll('[data-bs-toggle="tooltip"]')
//     );
//     tooltipTriggerList.forEach((el) => {
//       new Tooltip(el, {
//         delay: { show: 0, hide: 0 },
//         animation: true,
//       });
//     });
//   }, [location]); // re-run on route change
// }
