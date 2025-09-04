
import styles from "./style.module.css"
const data = [
     {
          ref: "01",
          description: "Web Design",
          price: "$499.00",
          qty: 3,
          amount: "$991.00",
     },
     {
          ref: "02",
          description: "Graphic Design",
          price: "$122.00",
          qty: 2,
          amount: "$421.00",
     },
     {
          ref: "03",
          description: "Graphic Design For Brocher",
          price: "$102.00",
          qty: 2,
          amount: "$981.00",
     },
     {
          ref: "04",
          description: "Logs Design",
          price: "$223.00",
          qty: 9,
          amount: "$390.00",
     },
     {
          ref: "05",
          description: "Flayar Designs",
          price: "$710.00",
          qty: 1,
          amount: "$580.00",
     },
];

function Invoice3_Orange() {
     return (
          <div>
               <div className={styles.hippo_tpl002_beeinvoicepage_orange}>
                    <div className={styles.hippo_tpl002_beeinvoicepage}>
                         <div className={styles.hippo_tpl002_header}>
                              <img className={styles.hippo_tpl002_logo} src="images/ready-logo-orange.svg" alt="" />
                         </div>
                         <div className={styles.hippo_tpl002_invoice_text}>
                              <h2>INVOICE</h2>
                              <span>Project: Web Design Quotation</span>
                         </div>
                         <div className={styles.hippo_tpl002_header_due}>
                              <div className={styles.hippo_tpl002_header_due_left}>
                                   <p><span>Invoice No:</span> 1231</p>
                                   <p><span>Invoice Date:</span> 02/11/2016 </p>
                                   <p><span>Account No: </span> 003</p>
                              </div>
                              <div className={styles.hippo_tpl002_header_due_left}>
                                   <p><span>Invoice To:</span></p>
                                   <p>Bussines Co. Ltd </p>
                                   <p>Danny Smith</p>
                                   <p>01 Linkd Road Office, 2  </p>
                              </div>
                              <div className={styles.hippo_tpl002_header_due_left}>
                                   <p><span>Office Address</span></p>
                                   <p>San Francisco ST, 23</p>
                                   <p>9478, Australio</p>
                                   <p>002-453-239 </p>
                              </div>
                         </div>
                         <table className={styles.hippo_tpl002_table}>
                              <thead className={styles.hippo_tpl002_thead}>
                                   <tr>
                                        <th className={styles.hippo_tpl002_th}>Ref</th>
                                        <th className={styles.hippo_tpl002_th}>Item Description</th>
                                        <th className={styles.hippo_tpl002_th}>Unit Price</th>
                                        <th className={styles.hippo_tpl002_th}>Quantity</th>
                                        <th className={styles.hippo_tpl002_th}>Total</th>
                                   </tr>
                              </thead>
                              <tbody className={styles.hippo_tpl002_tbody}>
                                   {data.map((item, index) => (
                                        <tr
                                             key={index}
                                             className={
                                                  index % 2 === 1
                                                       ? styles.hippo_tpl002_row
                                                       : styles.hippo_tpl002_row_alt
                                             }
                                        >
                                             <td className={styles.hippo_tpl002_td}>{item.ref}</td>
                                             <td className={styles.hippo_tpl002_td}>
                                                  <strong>{item.description}</strong>
                                                  <p className={styles.hippo_tpl002_desc}>
                                                       At mei meis homero accusam, quas accumsan elel ifend ex est, accums is an is nsibol.
                                                  </p>
                                             </td>
                                             <td className={styles.hippo_tpl002_td}>{item.price}</td>
                                             <td className={styles.hippo_tpl002_td}>{item.qty}</td>
                                             <td className={styles.hippo_tpl002_td_amount}>{item.amount}</td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                         <div className={styles.hippo_tpl002_totalsWrapper}>
                              <div className={styles.hippo_tpl002_paymentBox}>
                                   <div className={styles.hippo_tpl002_paymentborder}>
                                        <p className={styles.hippo_tpl002_paymentLabel}>Payment Method</p>
                                        <p className={styles.hippo_tpl002_paymentItem}>
                                             At mei meis homero accusam, quas accumsan eleifend ex est, the accums is an is nsibol ill uskal ullamcorper qui in Possim.At mei is homero accusam, quas accumsan.
                                        </p>
                                   </div>
                              </div>

                              <table className={styles.hippo_tpl002_totalTable}>
                                   <tbody>
                                        <tr>
                                             <td className={styles.hippo_tpl002_totalLabel}>SUB-TOTAL</td>
                                             <td className={styles.hippo_tpl002_totalValue}>$16.500</td>
                                        </tr>
                                        <tr className={styles.hippo_tpl002_totalLabelbg}>
                                             <td className={styles.hippo_tpl002_totalLabel}>TAX</td>
                                             <td className={styles.hippo_tpl002_totalValue}>$3.300</td>
                                        </tr>
                                        <tr>
                                             <td className={styles.hippo_tpl002_totalLabel}>DISCOUNT 10%</td>
                                             <td className={styles.hippo_tpl002_totalValue}>$1.980</td>
                                        </tr>
                                        <tr className={styles.hippo_tpl002_totalRow}>
                                             <td className={styles.hippo_tpl002_totalText}>TOTAL</td>
                                             <td className={styles.hippo_tpl002_totalAmount}>$19.800</td>
                                        </tr>
                                   </tbody>
                              </table>
                         </div>
                         <div className={styles.hippo_tpl002_totalsWrapper}>
                              <div className={styles.hippo_tpl002_paymentBox}>
                                   <div className={styles.hippo_tpl002_paymentborder}>
                                        <p className={styles.hippo_tpl002_paymentLabel}>Terms</p>
                                        <p className={styles.hippo_tpl002_paymentItem}>
                                             At mei meis homero accusam, quas accumsan eleifend ex est, the
                                        </p>
                                   </div>
                              </div>
                         </div>
                         <div className={styles.hippo_tpl002_totalsWrapper}>
                              <h2> <span>THANK YOU</span> FOR YOUR BUSINESS!</h2>
                         </div>
                         <div className={styles.hippo_tpl002_footer}>
                              <div className={styles.hippo_tpl002_footer_inner}>
                                   <div className={styles.hippo_tpl002_footer_list}>
                                        <img src="images/location.svg" alt="" />
                                        <p>Street 25 Alamrya Avenue <br></br>
                                             New York City House No.2</p>
                                   </div>
                                   <div className={styles.hippo_tpl002_footer_list}>
                                        <img src="images/phone.svg" alt="" />
                                        <p>001 - 123 456 789<br></br>
                                             001 - 897 602 302</p>
                                   </div>
                                   <div className={styles.hippo_tpl002_footer_list}>
                                        <img src="images/mail.svg" alt="" />
                                        <p>loremipsum@domain.com <br></br>
                                             loremipsum@domain.com</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default Invoice3_Orange
