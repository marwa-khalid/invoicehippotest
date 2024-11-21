import { KTIcon } from "../../../../_metronic/helpers";
import { EstimationActivitiesResult } from "../quotes/components/core/_models";

const Activities = (activities: any) => {
  
  return (
    <div className="timeline">
      {activities?.activities?.result?.map(
        (activity: EstimationActivitiesResult, index: number) => {
          const [date, time] = activity.dateCreatedAsString.split(" ");
          return (
            <div className="timeline-item" key={index}>
              <div className="timeline-line w-40px"></div>
              <div className="timeline-icon symbol symbol-circle symbol-40px me-4">
                <div className="symbol-label bg-light">
                  <KTIcon
                    iconName="message-text-2"
                    className="fs-2 text-gray-500"
                  />
                </div>
              </div>
              <div className="timeline-content mb-7 mt-n1">
                <div className="pe-3 mb-5">
                  <div className="fs-5 fw-bold mb-2">
                    {activity.activity.description}
                  </div>
                  <small className="text-muted">{activity.description}</small>
                  <div className="d-flex mt-1 fs-6 flex-column ">
                    <div className="text-muted me-2 fs-7 mb-3 d-flex align-items-center">
                      <i className="fas fa-calendar-alt me-2"></i>
                      <span>{date}</span>
                      <i className="fas fa-clock mx-2"></i>
                      <span>{time}</span>
                    </div>
                    <div>
                      {activity.userEmail && (
                        <span className="badge bg-secondary">
                          {activity.userEmail}
                        </span>
                      )}
                      {activity.userEmail && activity.actorType && (
                        <small className="mx-2">-</small>
                      )}

                      {activity.actorType && (
                        <span className="badge bg-secondary">
                          {activity.actorType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export { Activities };
