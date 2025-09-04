import React from "react";
import {
  MutationsModel,
  MutationsResult,
} from "../accounting/bookings/components/core/_models";
import { useIntl } from "react-intl";
import { useAuth } from "../auth";

interface MutationsProps {
  mutations: MutationsResult[] | Record<number, MutationsModel>;
  id?: number;
}

const Mutations: React.FC<MutationsProps> = ({ mutations, id }) => {
  const intl = useIntl();
  const { currentUser } = useAuth();

  const mutationList: MutationsResult[] = id
    ? (mutations as Record<number, MutationsModel>)[id]?.result || []
    : (mutations as MutationsResult[]) || [];

  return (
    <>
      {mutationList && (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="text-muted fw-normal">
                  {intl.formatMessage({ id: "Fields.TransactionDate" })}
                </th>
                <th className="text-muted fw-normal">
                  {intl.formatMessage({ id: "Fields.LedgerAccount" })}
                </th>
                <th className="text-muted fw-normal text-end">
                  {intl.formatMessage({ id: "Fields.DebetAmount" })}
                </th>
                <th className="text-muted fw-normal text-end">
                  {intl.formatMessage({ id: "Fields.CreditAmount" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {mutationList?.map((result, index) => (
                <React.Fragment key={index}>
                  {/* Title row */}
                  <tr className="table-light">
                    <td colSpan={4} className="fw-bold">
                      {result.title}
                    </td>
                  </tr>

                  {/* Items rows */}
                  {result.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>
                        <i className="fas fa-calendar-alt me-2 fs-7"></i>
                        {item.mutationDateAsString}
                      </td>
                      <td>{item.ledgerAccountDisplayName}</td>
                      <td className="text-end">
                        {item.debetAmount !== 0 && (
                          <>
                            {
                              currentUser?.result?.activeCompanyDefaults
                                ?.defaultValuta?.sign
                            }
                            {item.debetAmount.toFixed(2)}
                          </>
                        )}
                      </td>
                      <td className="text-end">
                        {item.creditAmount !== 0 && (
                          <>
                            {
                              currentUser?.result?.activeCompanyDefaults
                                ?.defaultValuta?.sign
                            }
                            {item.creditAmount.toFixed(2)}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export { Mutations };
