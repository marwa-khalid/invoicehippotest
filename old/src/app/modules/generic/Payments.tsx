import React, { useState } from "react";
import { PaymentsResult } from "../invoices/overview/core/_models";
import { useIntl } from "react-intl";
import { useAuth } from "../auth";
import { PaymentDeleteModal } from "./PaymentDeleteModal";

interface Props {
  payments: {
    result: PaymentsResult[];
  };
  refresh: boolean;
  setRefresh: (type: boolean) => void;
}

const Payments: React.FC<Props> = ({ payments, refresh, setRefresh }) => {
  const intl = useIntl();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [currentPayment, setCurrentPayment] = useState<any>();
  const openDeleteModal = (payment: PaymentsResult) => {
    setDeleteModalOpen(true);
    setCurrentPayment(payment);
  };
  const { currentUser } = useAuth();
  return (
    <>
      {deleteModalOpen && (
        <PaymentDeleteModal
          deleteModalId={currentPayment.id}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          title={currentPayment.PaymentMethodDescription}
          date={currentPayment.dateOfPaymentAsString}
        />
      )}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="text-muted fw-normal">
                {intl.formatMessage({ id: "Fields.DateOfPayment" })}
              </th>
              <th className="text-muted fw-normal">
                {intl.formatMessage({ id: "Fields.PaymentMethodDescription" })}
              </th>

              <th className="text-muted fw-normal text-end">
                {intl.formatMessage({ id: "Fields.IsBookedFromTransaction" })}
              </th>
              <th className="text-muted fw-normal text-end">
                {intl.formatMessage({ id: "Fields.Amount" })}
              </th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {payments?.result?.map((payment: PaymentsResult) => (
              <tr key={payment.id}>
                <td>
                  <i className="fas fa-calendar-alt me-2 fs-7"></i>
                  {payment.dateOfPaymentAsString}
                </td>
                <td>{payment.paymentMethodDescription}</td>

                <td className="text-end">
                  {payment.isBookedFromTransaction && (
                    <>
                      <i className="ki-duotone ki-check text-success fs-2x" />
                    </>
                  )}
                </td>
                <td className="text-end">
                  {payment.paymentAmount !== 0 && (
                    <>
                      {
                        currentUser?.result?.activeCompanyDefaults
                          ?.defaultValuta?.sign
                      }
                      {payment.paymentAmount.toFixed(2)}
                    </>
                  )}
                </td>
                {payment.actions.canDelete && (
                  <td
                    onClick={() => {
                      openDeleteModal(payment);
                    }}
                  >
                    <i className="ki-solid ki-trash text-danger fs-2 cursor-pointer"></i>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export { Payments };
