import { useIntl } from "react-intl";
import "./InvoiceTemplate.css";

const InvoiceTemplate2 = ({ data }: any) => {
  const intl = useIntl();
  return (
    <div className="invoice-container">
      <div className="invoice-header d-flex" id="header">
        <div className="invoice-left mt-20 ms-20 d-flex gap-10">
          <div>
            <img src={data?.company.companyLogoUrl} alt="Logo" height={130} />
          </div>
          <div>
            <h6 className="text-muted mb-1">Invoice To.</h6>
            <h5 className="fw-bold fs-1 mb-0">
              {data?.client.contactFullName}
            </h5>
            <div>{data?.client.companyName}</div>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: data?.client.invoiceAddress,
                }}
              />
            </div>
            <div>{data?.client.contactEmailAddress}</div>
          </div>
        </div>

        <div className="invoice-right text-white p-4 ms-auto position-relative text-center">
          <div>
            <div className="mb-2">
              <div className="fs-2">
                {intl.formatMessage({ id: "Fields.TabInvoice" })} #{" "}
                {data?.invoiceNr}
              </div>
            </div>
            <div className="d-flex mb-2 gap-10 justify-content-center">
              <div className="mb-2">
                <div className="text-muted">
                  {intl.formatMessage({ id: "Fields.InvoiceDate" })}
                </div>
                <div>{data?.invoiceDateAsString}</div>
              </div>
              <div>
                <div className="text-muted">
                  {intl.formatMessage({ id: "Fields.InvoiceDueDate" })}
                </div>
                <div>{data?.invoiceDueDateAsString}</div>
              </div>
            </div>
          </div>

          {/* Decorative green corner */}
          <div className="invoice-green-corner position-absolute"></div>
        </div>
        {/* 
        <div className="green-ribbon" /> */}
      </div>



      <div className="invoice-content pt-0" id="content">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>{intl.formatMessage({ id: "Fields.Product" })}</th>
              <th>{intl.formatMessage({ id: "Fields.Amount" })}</th>
              <th>{intl.formatMessage({ id: "Fields.Units" })}</th>
              <th>{intl.formatMessage({ id: "Fields.UnitType" })}</th>
              <th>{intl.formatMessage({ id: "Fields.VatTitle" })}</th>
              <th>{intl.formatMessage({ id: "Fields.Total" })}</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((p: any, index: number) => {
              const isGreenRow = index % 2 === 1;
              return (
                <>
                  <tr
                    key={index}
                    className={`invoice-row ${
                      isGreenRow ? "green-row" : "gray-row"
                    }`}
                  >
                    <td>{p.title}</td>
                    <td>{p.unitPrice}</td>
                    <td>{p.units}</td>
                    <td>{p.unitTypeDisplayName}</td>
                    <td>{p.vatTypeDisplayName}</td>
                    <td>
                      {data?.valuta.sign}
                      {p.unitPrice}
                    </td>
                  </tr>
                  <div className="p-5">
                    <span dangerouslySetInnerHTML={{ __html: p.description }} />
                  </div>
                </>
              );
            })}
          </tbody>
        </table>
        <div className="bottom-section">
          <div className="payment-method">
            <strong>Payment Method.</strong>
            <div>
              <strong>Account Name:</strong> {data?.company.accountHolderName}
            </div>
            <div>
              <strong>Account:</strong> {data?.company.accountNrIBAN}
            </div>
            <div>
              <strong>Bank:</strong> {data?.company.accountCompany}
            </div>
          </div>

          <div className="totals">
            <div className="totals-line">
              <span>Sub-Total:</span>
              <span>
                {data?.valuta.sign}
                {data?.totals.totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="totals-line">
              <span>Tax Vat:</span>
              <span>
                {data?.valuta.sign}
                {data?.totals.totalVATAmount.toFixed(2)}
              </span>
            </div>
            <div className="totals-line total">
              <strong>Total:</strong>
              <strong>
                {data?.valuta.sign}
                {data?.totals.totalPriceWithVAT.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between gap-20 mt-10 align-items-center">
          <div className="terms">
            <strong>Terms & Condition.</strong>
            <p>
              Web design is the digital face of your brand, shaping user
              perceptions and driving engagement. Through intuitive interfaces
              and captivating visuals, it creates memorable online experiences
              that resonate with your audience.
            </p>
          </div>

          <div className="signature">
            <div>{data?.client.contactFullName}</div>
            <small>Manager</small>
          </div>
        </div>
      </div>
      <div className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-col">
            <div>📞 031 333 666 9999</div>
            <div>✉️ example@gmail.com</div>
          </div>
          <div className="footer-col">
            <div>🌐 https://mijn-tst.invoicehippo.nl</div>
            <div className="d-flex">
              <span>📍 </span>

              <span
                dangerouslySetInnerHTML={{
                  __html: data?.company.addressAsHtml,
                }}
              ></span>
            </div>
          </div>
        </div>
        <div className="footer-right"></div>
        {/* <button className="no-print" onClick={() => window.print()}>
          Print / Save as PDF
        </button> */}
      </div>
    </div>
  );
};

export default InvoiceTemplate2;
