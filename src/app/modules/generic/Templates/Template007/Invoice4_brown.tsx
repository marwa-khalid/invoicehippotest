
import styles from "./style.module.css"
const data = [
     {
          description: "Web Design",
          price: "$250.00",
          qty: "03",
          amount: "$750.00",
     },
     {
          description: "Business Card Design",
          price: "$300.00",
          qty: "04",
          amount: "$1200.00",
     },
     {
          description: "Flyer Design",
          price: "$200.00",
          qty: "01",
          amount: "$200.00",
     },
     {
          description: "Resume Design",
          price: "$500.00",
          qty: "02",
          amount: "$1000.00",
     },
     {
          description: "Brochures Design",
          price: "$400.00",
          qty: "05",
          amount: "$2000.00",
     },
];


function Invoice4_brown() {
     return (
          <div className={styles.hippo_tpl003_beeinvoicepage_brown}>
          <div className={styles.hippo_tpl003_beeinvoicepage}>
               <div className={styles.hippo_tpl003_invoice_header}>
                    <div className={styles.hippo_tpl003_header}>
                         <img className={styles.hippo_tpl003_logo} src="/images/logo.svg" alt="" />
                    </div>
                    <div>
                         <div className={styles.hippo_tpl003_header_list}>
                              <img src="/images/location-2.svg" alt="" />
                              1234 Street Address, City Name
                         </div>
                         <div className={styles.hippo_tpl003_header_list}>
                              <img src="/images/phone-icon2.svg" alt="" />
                              +000 12134 56789
                         </div>
                         <div className={styles.hippo_tpl003_header_list}>
                              <img src="/images/email-icon2.svg" alt="" />
                              jonathansmith@example.com
                         </div>
                    </div>
               </div>
               <div className={styles.hippo_tpl003_invoice_text}>
                    <div className={styles.hippo_tpl003_profile_detail}>
                         <h6>INVOICE TO:</h6>
                         <h3>MICHAEL SMITH</h3>
                         <p>1234 Street Address Country name city - 2211<br></br>
                              info@companymail.com</p>
                    </div>
                    <div>
                         <h2>INVOICE</h2>
                         <div className={styles.hippo_tpl003_header_due_left}>
                              <p><span>Invoice No:</span> 1231</p>
                              <p><span>Invoice Date:</span> 02/11/2016 </p>
                              <p><span>Account No: </span> 003</p>
                         </div>
                    </div>
               </div>
               <table className={styles.hippo_tpl003_table}>
                    <thead className={styles.hippo_tpl003_thead}>
                         <tr>
                              <th className={styles.hippo_tpl003_th}>Item Description</th>
                              <th className={styles.hippo_tpl003_th}>Unite Price</th>
                              <th className={styles.hippo_tpl003_th}>Quantity</th>
                              <th className={styles.hippo_tpl003_th}>Total</th>
                         </tr>
                    </thead>
                    <tbody className={styles.hippo_tpl003_tbody}>
                         {data.map((item, index) => (
                              <tr
                                   key={index}
                                   className={
                                        index % 2 === 0
                                             ? styles.hippo_tpl003_row
                                             : styles.hippo_tpl003_row_alt
                                   }
                              >
                                   <td className={styles.hippo_tpl003_td}>
                                        <strong>{item.description}</strong>
                                        <p className={styles.hippo_tpl003_desc}>
                                             Lorem Ipsum is simply dummy text of the printing
                                        </p>
                                   </td>
                                   <td><span className={styles.hippo_tpl003_td}>{item.price}</span></td>
                                   <td><span className={styles.hippo_tpl003_td}>{item.qty}</span></td>
                                   <td><span className={styles.hippo_tpl003_td}>{item.amount}</span></td>
                              </tr>
                         ))}
                    </tbody>
               </table>
               <div className={styles.hippo_tpl003_totalsWrapper}>
                    <div className={styles.hippo_tpl003_paymentBox}>
                         <div className={styles.hippo_tpl003_paymentborder}>
                              <p className={styles.hippo_tpl003_paymentLabel}>Payment Method <span> We Accept</span></p>
                              <p className={styles.hippo_tpl003_paymentLabel}>Card Payment <span className={styles.hippo_tpl003_d_block}> We Accept Visa Mastercard</span></p>
                         </div>
                    </div>
     
                    <table className={styles.hippo_tpl003_totalTable}>
                         <tbody>
                              <tr>
                                   <td className={styles.hippo_tpl003_totalLabel}>Sub Total</td>
                                   <td className={styles.hippo_tpl003_totalValue}>$5150.00</td>
                              </tr>
                              <tr className={styles.hippo_tpl003_totalLabelbg}>
                                   <td className={styles.hippo_tpl003_totalLabel}>Tax: VAT 10% </td>
                                   <td className={styles.hippo_tpl003_totalValue}>$515.00</td>
                              </tr>
                              <tr>
                                   <td className={styles.hippo_tpl003_totalLabel}>Discount 5%</td>
                                   <td className={styles.hippo_tpl003_totalValue}>$260.00</td>
                              </tr>
                              <tr className={styles.hippo_tpl003_totalRow}>
                                   <td className={styles.hippo_tpl003_totalText}>GRAND TOTAL  </td>
                                   <td className={styles.hippo_tpl003_totalAmount}>$5925.00</td>
                              </tr>
                         </tbody>
                    </table>
               </div>
               <div className={styles.hippo_tpl003_totalsWrapper}>
                    <div className={styles.hippo_tpl003_paymentBox}>
                         <div className={styles.hippo_tpl003_paymentborder}>
                              <h6 className={styles.hippo_tpl003_paymentLabel}>Thank you for your business!</h6>
                              <p className={styles.hippo_tpl003_paymentItem}>
                                   <span>Terms:</span>  Contrary to popular belief Lorem Ipsum is simply dummy  text of the printing and typesetting industry.
                              </p>
                         </div>
                    </div>
               </div>
          </div>
     </div>
     )
}

export default Invoice4_brown
