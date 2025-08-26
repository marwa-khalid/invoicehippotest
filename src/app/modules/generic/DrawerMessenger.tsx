import { FC, useEffect, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { getTasks } from "./core/_requests";
import { TaskResult } from "./core/_models";
import { useIntl } from "react-intl";

const DrawerMessenger: FC = () => {
  const [tasks, setTasks] = useState<TaskResult[]>();
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        if (res.isValid) {
          setTasks(res.result);
        }
      } catch {}
    };
    fetchTasks();
  }, []);
  const intl = useIntl();
  return (
    <div
      id="kt_drawer_tasks"
      className="bg-body"
      data-kt-drawer="true"
      data-kt-drawer-name="chat"
      data-kt-drawer-activate="true"
      data-kt-drawer-overlay="true"
      data-kt-drawer-width="{default:'300px', 'md': '500px'}"
      data-kt-drawer-direction="end"
      data-kt-drawer-toggle="#kt_drawer_tasks_toggle"
      data-kt-drawer-close="#kt_drawer_tasks_close"
    >
      <div className="card w-100 rounded-0" id="kt_drawer_tasks_messenger">
        <div className="card-header pe-5" id="kt_drawer_tasks_messenger_header">
          <div className="card-title">
            <div className="d-flex justify-content-center flex-column me-3">
              <a
                href="#"
                className="fs-4 fw-bolder text-gray-900 text-hover-primary me-1 mb-2 lh-1"
              >
                {intl.formatMessage({
                  id: "Fields.DashboardActionsAndMessages",
                })}
              </a>

              {/* <div className="mb-0 lh-1">
                <span className="badge badge-success badge-circle w-10px h-10px me-1"></span>
                <span className="fs-7 fw-bold text-gray-500">Active</span>
              </div> */}
            </div>
          </div>

          <div className="card-toolbar">
            {/* <div className="me-2">
              <button
                className="btn btn-sm btn-icon btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                <i className="bi bi-three-dots fs-3"></i>
              </button>
            </div> */}

            <div
              className="btn btn-sm btn-icon btn-active-light-primary"
              id="kt_drawer_tasks_close"
            >
              <KTIcon iconName="cross" className="fs-2" />
            </div>
          </div>
        </div>
        {/* 
        <ChatInner isDrawer={true} /> */}

        <div className="space-y-4 p-7">
          {tasks?.map((task, index) => (
            <div
              key={index}
              className={`alert alert-dismissible bg-light-${task.infoColor} d-flex align-items-center flex-column flex-sm-row p-5 mb-10 `}
              style={{ borderLeft: `6px solid var(--bs-${task.infoColor})` }}
            >
              <i
                className={`ki-duotone ki-notification-bing fs-2hx text-${task.infoColor} me-4 mb-5 mb-sm-0`}
              >
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>

              <div
                className={`d-flex flex-column pe-0 pe-sm-10 text-${task.infoColor}`}
              >
                <span dangerouslySetInnerHTML={{ __html: task.title }} />
              </div>
              {task.canClose && (
                <button
                  type="button"
                  className="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto"
                  data-bs-dismiss="alert"
                >
                  <i
                    className={`ki-duotone ki-cross fs-1 text-${task.infoColor}`}
                  >
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { DrawerMessenger };
