import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  CallIcon,
  Mail02Icon,
  GlobalIcon,
  House01Icon,
} from "@hugeicons/core-free-icons";
import styles from "./style.module.css";
import { useIntl } from "react-intl";
import { QuoteViewDataResult } from "../../../quotes/overview/core/_models";
import React from "react";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";

interface Props {
  data: QuoteViewDataResult;
}

const Quote = ({ data }: Props) => {
  const formatDate = (dateStr: string): string => {
    const [day, month, year] = dateStr?.split("-")?.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  const intl = useIntl();
  return (
    <div className={styles.beeinvoicepage}>
      <div className={styles.beeTopHeader}>
        <img src={data?.companyLogoUrl.value} alt="Logo" />
      </div>

      <div className={styles.beeCardBody}>
        <h2 className={styles.beePageNm}>#{data?.invoiceNr.value}</h2>

        <div className={styles.beeHeader}>
          <div className={styles.beeHeaderLeft}>
            <p className={styles.beeHamburger}>
              <HugeiconsIcon icon={Menu01Icon} />
              {data?.invoiceDate.value && formatDate(data?.invoiceDate.value)}
            </p>
            <h1>
              {data?.invoiceIsCreditNota
                ? data?.invoiceCreditNota.value
                : data?.documentTitle}
            </h1>
          </div>

          <div className={styles.beeHeaderRight}>
            {data?.hasCompanyPhoneNr && (
              <a href={`tel:${data.companyPhoneNr.value}`}>
                <HugeiconsIcon icon={CallIcon} />
                {data.companyPhoneNr.value}
              </a>
            )}

            {data?.hasCompanyEmailAddress && (
              <a href={`mailto:${data.companyEmailAddress.value}`}>
                <HugeiconsIcon icon={Mail02Icon} />
                {data.companyEmailAddress.value}
              </a>
            )}
            {data?.hasCompanyWebUrl && (
              <a href={data.companyWebUrl.value}>
                <HugeiconsIcon icon={GlobalIcon} />
                {data.companyWebUrl.value}
              </a>
            )}
            <a>
              <HugeiconsIcon icon={House01Icon} />
              <span
                dangerouslySetInnerHTML={{
                  __html: data?.htmlCompanyAddress.value,
                }}
              />
            </a>
          </div>
        </div>

        <div className={styles.beeInvoiceDetails}>
          <div className={styles.beeInvoiceDetailsInner}>
            <h4>{data?.addressedToTitle}</h4>
            {data?.hasClientContactFullName && (
              <div className={styles.beeInvoiceDetailList}>
                <span>{data?.clientContactFullNameLabel.value}</span>
                <p>{data?.clientContactFullName.value}</p>
              </div>
            )}
            {data?.hasClientCompanyName && (
              <div className={styles.beeInvoiceDetailList}>
                <span>{data?.clientContactCompanyNameLabel.value}</span>
                <p>{data?.clientCompanyName.value}</p>
              </div>
            )}
            {data?.hasClientEmailAddress && (
              <div className={styles.beeInvoiceDetailList}>
                <span>{data?.clientContactEmailLabel.value}</span>
                <p>{data.clientEmailAddress.value}</p>
              </div>
            )}
            {data?.htmlClientAddress.value && (
              <div className={styles.beeInvoiceDetailList}>
                <span>{data?.clientContactAddressLabel.value}</span>
                <p
                  dangerouslySetInnerHTML={{
                    __html: data.htmlClientAddress.value,
                  }}
                />
              </div>
            )}
            {data?.hasCustomFieldsAreaOnClientDetails && (
              <div className={styles.beeInvoiceDetailList}>
                <span>
                  {data?.customFieldsAreaOnClientDetails[0].title.value}
                </span>
                <p>{data?.customFieldsAreaOnClientDetails[0].value.value}</p>
              </div>
            )}
          </div>

          <div
            className={`${styles.beeInvoiceDetailsInner} ${styles.beeInvoiceDetailsInner2}`}
          >
            {/* <h4>{intl.formatMessage({ id: "Fields.InvoiceClient" })}</h4> */}
            <div className={styles.beeInvoiceDetailList}>
              <span>{data?.companyFinancialAccountNameLabel.value}</span>
              <p>{data?.companyFinancialAccountName.value}</p>
            </div>
            <div className={styles.beeInvoiceDetailList}>
              <span>{data?.companyFinancialAccountHolderLabel.value}</span>
              <p>{data?.companyFinancialAccountHolder.value}</p>
            </div>
            <div className={styles.beeInvoiceDetailList}>
              <span>{data?.companyFinancialAccountIbanLabel.value}</span>
              <p>{data?.companyFinancialAccountIban.value}</p>
            </div>
            {data?.hasCustomFieldsAreaOnInvoiceOrQuoteDetails && (
              <div className={styles.beeInvoiceDetailList}>
                <span>
                  {data?.customFieldsAreaOnInvoiceOrQuoteDetails[0].title.value}
                </span>
                <p>
                  {data?.customFieldsAreaOnInvoiceOrQuoteDetails[0].value.value}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.beeInvoiceWrapper}>
          <table className={styles.beeInvoiceTable}>
            <thead>
              <tr>
                <th className={`${styles.beeTh} ${styles.beeAlignLeft}`}>
                  {data?.columnServiceLabel.value}
                </th>

                <th className={styles.beeTh}>{data?.columnUnitsLabel.value}</th>
                <th className={styles.beeTh}></th>
                <th className={styles.beeTh}>
                  {data?.columnAmountLabel.value}
                </th>
                <th className={styles.beeTh}>
                  {data?.columnBtwTypeLabel.value}
                </th>
                <th className={styles.beeTh}>{data?.columnTotalLabel.value}</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((item: any, i: number) => (
                <React.Fragment key={i}>
                  <tr>
                    <td className={`${styles.beeTd}`}>
                      <strong>{item.title.value}</strong>
                    </td>

                    <td className={styles.beeTd}>{item.units.value}</td>
                    <td className={`${styles.beeTd} ${styles.beeAlignLeft}`}>
                      {item.unitType.value}
                    </td>
                    <td className={styles.beeTd}>{item.unitPrice.value}</td>
                    <td className={styles.beeTd}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.btwType.value,
                        }}
                      />
                    </td>

                    <td className={styles.beeTd}>
                      {item.totalPrice.value}
                      <div className={styles.beeDiscount}>
                        {item.discountType.value && (
                          <small>-{item.discountType.value}</small>
                        )}
                      </div>
                    </td>
                  </tr>
                  {item?.description?.value && (
                    <tr>
                      <td colSpan={6} className={styles.beeItemDescription}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item?.description?.value,
                          }}
                        />
                      </td>
                    </tr>
                  )}
                  <tr className={styles.beeTdSep}></tr>
                </React.Fragment>
              ))}
            </tbody>

            <tfoot className={styles.beeTfoot}>
              {/* Row 1: Terms and Discount */}
              <tr>
                <td
                  className={`${styles.beeAlignLeft} ${styles.beePayment}`}
                  colSpan={3}
                >
                  {data?.invoicePaymentTermsQuote.value}
                </td>
                <td className={`${styles.beeTdDiscount}`}>
                  {data?.invoiceTotalAppliedDiscountLabel.value}
                </td>
                <td className={styles.beeInvoiceTaxDetail}>
                  <span>&nbsp;</span>
                </td>
                <td id="price-td" className={`${styles.beeTdDiscount}`}>
                  {data?.invoiceTotalAppliedDiscount.value}
                </td>
              </tr>

              {/* Row 2: Subtotal */}
              <tr>
                <td colSpan={3}></td>
                <td className={`${styles.beeTdDiscount}`}>
                  {data?.documentSubTotalPriceLabel.value}
                </td>
                <td className={styles.beeInvoiceTaxDetail}>
                  <span>&nbsp;</span>
                </td>
                <td id="price-td" className={styles.beeTdDiscount}>
                  {data?.invoiceTotalPrice.value}
                </td>
              </tr>

              {/* Row 3: VAT - show heading only once */}
              {data?.taxTotals?.length > 0 &&
                data.taxTotals.map((tax: any, index: number) => (
                  <tr key={index}>
                    {index === data.taxTotals.length - 1 ? (
                      <td
                        colSpan={3}
                        className={`${styles.borderBottom0} ${styles.beeInvoiceTerms} `}
                      >
                        <div className={styles.beeInvoiceTermsLeft}>
                          <h4>{data?.documentConditionsLabel.value}</h4>
                        </div>
                      </td>
                    ) : (
                      <td colSpan={3}></td>
                    )}

                    <td
                      className={`${styles.beeTdDiscount}  ${
                        index !== data.taxTotals.length - 1
                          ? styles.borderBottom0
                          : styles.beeBorderOrange
                      }`}
                    >
                      {index === 0 ? data?.invoiceVatSummaryLabel.value : null}
                    </td>
                    <td
                      className={`${styles.beeInvoiceTaxDetail} ${
                        index !== data.taxTotals.length - 1
                          ? styles.borderBottom0
                          : styles.beeBorderOrange
                      } ${styles.beeAlignRight}`}
                    >
                      <span>{tax.title?.value}</span>
                    </td>
                    <td
                      className={`${styles.beeInvoiceTaxDetail} ${
                        index !== data.taxTotals.length - 1
                          ? styles.borderBottom0
                          : styles.beeBorderOrange
                      }`}
                    >
                      <p>{tax.total?.value}</p>
                    </td>
                  </tr>
                ))}

              {/* Row 4: Grand Total */}
              <tr>
                <td colSpan={3} className={styles.beeInvoiceTerms}>
                  <div className={styles.beeInvoiceTermsLeft}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: data?.documentConditions.value,
                      }}
                    />
                  </div>
                </td>
                <td className={`${styles.beeLabel} ${styles.beeAlignRight}`}>
                  {data?.documentTotalPriceLabel.value}
                </td>
                <td className={styles.beeTd}></td>

                <td
                  className={`${styles.beeValue} ${
                    data?.invoiceTotalPriceWithVat?.value.includes("-") &&
                    styles.colorRed
                  } `}
                >
                  {data?.invoiceTotalPriceWithVat.value}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {data?.hasDataOfSignee && (
          <div className="signature text-end mt-5">
            <img
              src={data?.dataOfSignee.signSignatureBase64}
              width="content-fit"
              alt=""
              className="text-end"
            />
          </div>
        )}

        <div className={styles.comments}>
          {data?.hasCustomFieldsAreaBeforeComments && (
            <p
              dangerouslySetInnerHTML={{
                __html: data?.customFieldsAreaBeforeComments[0]?.value.value,
              }}
            />
          )}
          <span
            dangerouslySetInnerHTML={{ __html: data?.quoteComments?.value }}
          />
          <span
            dangerouslySetInnerHTML={{
              __html: data?.customFieldsAreaAfterComments[0]?.value.value,
            }}
          />
        </div>
      </div>

      <div className={styles.beeCardFooter}>
        <div className={styles.beeFooterInner}>
          {/* <img src={data?.companyLogoUrl.value} alt="Logo" /> */}
          <p>SAMPLE DATA</p>
        </div>
      </div>
    </div>
  );
};

export default Quote;
