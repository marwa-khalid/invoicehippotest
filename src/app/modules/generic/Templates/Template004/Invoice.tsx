
import styles from "./style.module.css"
const data = [
     {
          description: "Idea & Concept",
          price: "$1,750",
          qty: 2,
          amount: "$3,500",
     },
     {
          description: "Design and Development",
          price: "$1,125",
          qty: 4,
          amount: "$4,500",
     },
     {
          description: "Additional Services",
          price: "$500",
          qty: 3,
          amount: "$1,500",
     },
     {
          description: "Implementation",
          price: "$1,500",
          qty: 1,
          amount: "$1,500",
     },
     {
          description: "Go Live",
          price: "$1,500",
          qty: 1,
          amount: "$1,500",
     },
];

function Invoice1() {
     return (
          <div className={styles.hippo_tpl001_beeinvoicepage}>
          <div className={styles.hippo_tpl001_header}>
               <img className={styles.hippo_tpl001_logo} src="/images/logo.svg" alt="" />
               <div className={styles.hippo_tpl001_header_right}>
                    <h6>5th Avenue, 357 </h6>
                    <h6>New York City , NY, USA  </h6>
                    <h6><span>P:</span> +01.123.4567.890</h6>
                    <h6> <span>E:</span> info@website.com</h6>
                    <h6> <span>W:</span> www.website.com </h6>
               </div>
          </div>
          <div className={styles.hippo_tpl001_header_due}>
               <div className={styles.hippo_tpl001_header_due_left}>
                    <h6>Invoice to:</h6>
                    <p><span>Crap Raven Design Ltd.</span><br></br>
                         7th Floor, Office 12<br></br>
                         5th Avenue, 357<br></br>
                         New York City , NY<br></br>
                         United States</p>
               </div>
               <div className={styles.hippo_tpl001_header_due_right}>
                    <h1>INVOICE</h1>
                    <div className={styles.hippo_tpl001_header_due_row}>
                         <div>
                              <h6><span>Total Due:</span>
                                   $ 16.500</h6>
                         </div>
                         <div>
                              <h6><span>Total Due:</span>
                                   April 21st 2021</h6>
                         </div>
                         <div>
                              <h6><span>Invoice No.:
                              </span>
                                   22-04-2021-132.04</h6>
                         </div>
                    </div>
               </div>
          </div>
          <table className={styles.hippo_tpl001_table}>
               <thead className={styles.hippo_tpl001_thead}>
                    <tr>
                         <th className={styles.hippo_tpl001_th}>DESCRIPTION</th>
                         <th className={styles.hippo_tpl001_th}>PRICE/UNIT</th>
                         <th className={styles.hippo_tpl001_th}>QTY</th>
                         <th className={styles.hippo_tpl001_th}>AMOUNT</th>
                    </tr>
               </thead>
               <tbody className={styles.hippo_tpl001_tbody}>
                    {data.map((item, index) => (
                         <tr
                              key={index}
                              className={
                                   index % 2 === 0
                                        ? styles.hippo_tpl001_row
                                        : styles.hippo_tpl001_row_alt
                              }
                         >
                              <td className={styles.hippo_tpl001_td}>
                                   <strong>{item.description}</strong>
                                   <p className={styles.hippo_tpl001_desc}>
                                        Illiqui busamus re et qui to quodit accabo. Uga. Ut maximus
                                        remposam, illiis quisqui aliqua qui dolore rem.
                                   </p>
                              </td>
                              <td className={styles.hippo_tpl001_td}>{item.price}</td>
                              <td className={styles.hippo_tpl001_td}><strong>{item.qty}</strong></td>
                              <td className={styles.hippo_tpl001_td_amount}><strong>{item.amount}</strong></td>
                         </tr>
                    ))}
               </tbody>
          </table>
          <div className={styles.hippo_tpl001_totalsWrapper}>
               <div className={styles.hippo_tpl001_paymentBox}>
                 <div className={styles.hippo_tpl001_paymentborder}>
                 <div className={styles.hippo_tpl001_paymentborder_inner}></div>
                         <p className={styles.hippo_tpl001_paymentLabel}>Payment to:</p>
                         <p className={styles.hippo_tpl001_paymentItem}>
                              Paypal: info@paypalacc.com
                         </p>
                    </div>
                    <p className={styles.hippo_tpl001_paymentItem}>
                         Bank: Bank Name, Account, Account: 25-68-34
                    </p>
               </div>
      
               <table className={styles.hippo_tpl001_totalTable}>
                    <tbody>
                         <tr>
                              <td className={styles.hippo_tpl001_totalLabel}>SUB-TOTAL</td>
                              <td className={styles.hippo_tpl001_totalValue}>$16.500</td>
                         </tr>
                         <tr>
                              <td className={styles.hippo_tpl001_totalLabel}>TAX</td>
                              <td className={styles.hippo_tpl001_totalValue}>$3.300</td>
                         </tr>
                         <tr>
                              <td className={styles.hippo_tpl001_totalLabel}>DISCOUNT 10%</td>
                              <td className={styles.hippo_tpl001_totalValue}>$1.980</td>
                         </tr>
                         <tr className={styles.hippo_tpl001_totalRow}>
                              <td className={styles.hippo_tpl001_totalText}>TOTAL</td>
                              <td className={styles.hippo_tpl001_totalAmount}>$19.800</td>
                         </tr>
                    </tbody>
               </table>
          </div>
          <div id="terms" className={`${styles.hippo_tpl001_totalsWrapper} ${styles.hippo_tpl003_terms_wrapper}`}>
               <div className={styles.hippo_tpl001_paymentBox}>
                    <div className={styles.hippo_tpl001_paymentborder}>
                      <div className={styles.hippo_tpl001_paymentborder_inner}></div>
                         <p className={styles.hippo_tpl001_paymentLabel}>Terms & Conditions:</p>
                         <p className={styles.hippo_tpl001_paymentItem}>
                              Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget,
                              imperdiet nec, imperdiet tetuer eget, posuere ut, mauris.
                              Praes e ipsum primis in faucibus orent adipiscing.
                         </p>
                    </div>
               </div>
          </div>
          <div className={styles.hippo_tpl001_terms_header}>
          </div>
         
      </div>
     )
}

export default Invoice1
