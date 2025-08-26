import React from "react";
import { useIntl } from "react-intl";
import { Content } from "../../../../../../_metronic/layout/components/content";
interface CompanyLicense {
  title: string;
  validFromAsString: string;
  validTillAsString: string;
  usagePercentage: number;
  isActive: boolean;
}

interface Company {
  id: string;
  companyName: string;
  licenseInfo: CompanyLicense;
}

interface CompaniesTabProps {
  usage: any;
}

const CompaniesTab: React.FC<CompaniesTabProps> = ({ usage }) => {
  const intl = useIntl();

  const handleAddCompany = () => {
    const confirmMsg = intl.formatMessage({
      id: "Confirm.AddCompanyBillingNotice",
      defaultMessage:
        "Adding an extra company may increase your current billing depending on the license type you choose. Do you want to proceed?",
    });

    if (window.confirm(confirmMsg)) {
      // TODO: navigate to add company screen or open modal
      console.log("Redirect to add company screen...");
    }
  };

  const handleTakeOver = (company: Company) => {
    // TODO: handle take over logic
    console.log(`Taking over company: ${company.companyName}`);
  };

  const handleProlongLicense = (company: Company) => {
    // TODO: handle license prolong logic
    console.log(`Prolonging license for: ${company.companyName}`);
  };

  return (
    <Content>
      <div className=" mb-5 mb-xl-10">
        {/* <div
          className="card-header border-0 cursor-pointer"
          role="button"
          data-bs-toggle="collapse"
          data-bs-target="#kt_account_profile_details"
          aria-expanded="true"
          aria-controls="kt_account_profile_details"
        >
          <div className="card-title m-0">
            <h3 className="fw-bolder m-0">Companies</h3>
          </div>
        </div> */}

        <div id="kt_account_profile_details" className="collapse show">
          <form noValidate className="form">
            <div className="">
              {usage?.usagePerCompany?.map((company: any) => {
                const license = company.licenseInfo;
                const isActive = license.isActive;

                return (
                  <div key={company.id} className="card mb-4">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start flex-wrap">
                        <div>
                          <h5 className="mb-2">{company.companyName}</h5>
                          <div className="text-muted mb-1">
                            License: <strong>{license.title}</strong> (
                            {license.validFromAsString} -{" "}
                            {license.validTillAsString})
                          </div>

                          <div className="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                            <div className="d-flex justify-content-between w-100 mt-auto mb-2">
                              <span className="fw-bold fs-6 text-gray-500">
                                Usage Percentage
                              </span>
                              <span className="fw-bolder fs-6">
                                {
                                  usage?.usagePerCompany[0].licenseInfo
                                    .usagePercentage
                                }
                                %
                              </span>
                            </div>
                            <div className="h-5px mx-3 w-100 bg-light mb-3">
                              <div
                                className={`${
                                  usage?.usagePerCompany[0].licenseInfo
                                    .usagePercentage < 70
                                    ? "bg-success"
                                    : usage?.usagePerCompany[0].licenseInfo
                                        .usagePercentage > 90
                                    ? "bg-danger"
                                    : "bg-warning"
                                } rounded h-5px`}
                                role="progressbar"
                                style={{
                                  width: `${usage?.usagePerCompany[0].licenseInfo.usagePercentage}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mt-3 mt-md-0 align-items-end">
                          {isActive && (
                            <button
                              className="btn btn-sm btn-icon"
                              onClick={() => handleTakeOver(company)}
                            >
                              <i className="ki-duotone ki-rocket text-warning fs-1">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleProlongLicense(company)}
                          >
                            Prolong License
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card-footer d-flex justify-content-end py-6 px-9">
              <button className="btn btn-primary" onClick={handleAddCompany}>
                + Add Extra Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </Content>
  );
};

export { CompaniesTab };
