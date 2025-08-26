import { useAuth } from "../../../auth";
import { KTSVG } from "../../../../../_metronic/helpers";

type SwitchMenuProps = {
  setActiveCompanyId: (type: number) => void;
  activeCompanyId?: number;
  setIsOpen: (type: boolean) => void;
  isOpen: boolean;
  toggleMenu: () => void;
};

const CompanySwitchMenu = ({
  setActiveCompanyId,
  activeCompanyId,
  isOpen,
}: SwitchMenuProps) => {
  const { currentUser } = useAuth();
  const companies = currentUser?.result.companies;

  const handleSwitch = (id: number) => {
    setActiveCompanyId(id);
  };

  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      {companies?.map((company: any, index: number) => (
        <div className="p-3 " key={company.id}>
          <div className="d-flex align-items-center">
            {company.id !== activeCompanyId ? (
              <div
                className="cursor-pointer"
                onClick={() => handleSwitch(company.id)}
              >
                <KTSVG
                  className="svg-icon svg-icon-1 me-2"
                  path="media/icons/hugeicons/square-arrow-transfer.svg"
                />
                <span className="">{company.title}</span>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <i className="ki-duotone ki-verify fs-2x text-success me-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
                <span className="">{company.title}</span>
              </div>
            )}
          </div>
          {index < companies.length - 1 && (
            <div className="separator mt-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export { CompanySwitchMenu };
