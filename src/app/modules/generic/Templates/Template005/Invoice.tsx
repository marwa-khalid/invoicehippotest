
import styles from "./style.module.css"
const data = [
     { id: 1, title: "Brochure Design", unitPrice: 200, quantity: 1 },
     { id: 2, title: "Web Design", unitPrice: 400, quantity: 1 },
     { id: 3, title: "UI Design", unitPrice: 150, quantity: 3 },
     { id: 4, title: "Graphic Design", unitPrice: 80, quantity: 2 },
     { id: 5, title: "Logo Design", unitPrice: 50, quantity: 1 },
     { id: 6, title: "Banner Design", unitPrice: 39, quantity: 7 },
];


function Invoice2() {
     return (
     <div className={styles.hippo_tpl004_beeinvoicepage}>
          <div className={styles.hippo_tpl004_invoice_header}>
               <div className={styles.hippo_tpl004_header}>
                    <img className={styles.hippo_tpl004_logo} src="/images/logo.svg" alt="" />
               </div>
               <div className={styles.hippo_tpl004_header_flex}>
                    <div className={styles.hippo_tpl004_header_list}>
                         <img src="/images/location-2.svg" alt="" />
                         34 Street Taksim Square<br></br>
                         Pb:34100 Istanbul
                    </div>
                    <div className={styles.hippo_tpl004_header_list}>
                         <img src="/images/phone-icon2.svg" alt="" />
                         +90 536 443 11 91
                    </div>
                    <div className={styles.hippo_tpl004_header_list}>
                         <img src="/images/email-icon2.svg" alt="" />
                         info@business.com
                    </div>
                    <div className={styles.hippo_tpl004_header_list}>
                         <img src="/images/web-icon2.svg" alt="" />
                         www.business.com
                    </div>
               </div>
          </div>
          <div className={styles.hippo_tpl004_invoice_box}>
               <div className={styles.hippo_tpl004_invoice_number}>
                    <h2>INVOICE</h2>
                    <p>INVOICE NO : 150419</p>
               </div>
               <div className={styles.hippo_tpl004_invoice_table}>
                    <div className={styles.hippo_tpl004_invoice_table_left}>
                         <div className={styles.hippo_tpl004_tabel_heading}>
                              <span className={styles.hippo_tpl004_blue_box}></span>
                              <div className={styles.hippo_tpl004_table_invoice}>INVOICE TO : ARESKOM LIMITED CORP.</div>
                         </div>
                         <div className={styles.hippo_tpl004_invoice_location}>
                              <span className={styles.hippo_tpl004_blue_box}></span>
                              <span className={styles.hippo_tpl004_gray_box}><img src="/images/location-2.svg" alt="" /></span>
                              <div className={styles.hippo_tpl004_row_box}>34 Taksim Square Some Street, New York, US, 34100</div>
                         </div>
                         <div className={styles.hippo_tpl004_invoice_location}>
                              <span className={styles.hippo_tpl004_blue_box}></span>
                              <span className={styles.hippo_tpl004_gray_box}><img src="/images/phone-icon2.svg" alt="" /></span>
                              <div className={styles.hippo_tpl004_row_box}>+1 123 456 7890</div>
                         </div>
                         <div className={styles.hippo_tpl004_invoice_location}>
                              <span className={styles.hippo_tpl004_blue_box}></span>
                              <span className={styles.hippo_tpl004_gray_box}><img src="/images/email-icon2.svg" alt="" /></span>
                              <div className={styles.hippo_tpl004_row_box}>www.customersite.com</div>
                         </div>
                         <div className={styles.hippo_tpl004_invoice_location}>
                              <span className={styles.hippo_tpl004_blue_box}></span>
                              <span className={styles.hippo_tpl004_gray_box}><img src="/images/web-icon2.svg" alt="" /></span>
                              <div className={styles.hippo_tpl004_row_box}>info@customersite.com</div>
                         </div>
                    </div>
                    <div className={styles.hippo_tpl004_invoice_table_middle}>
                         <div className={styles.hippo_tpl004_table_invoice}>DATE - 06.09.2013</div>
                         <div className={styles.hippo_tpl004_table_row}>TOTAL DUE</div>
                         <div className={`${styles.hippo_tpl004_table_row + ' ' + styles.hippo_tpl004_table_row2}`}>2225.81 $</div>
                    </div>
                    <div className={styles.hippo_tpl004_invoice_table_middle}>
                         <div className={`${styles.hippo_tpl004_table_invoice + ' ' + styles.hippo_tpl004_table_invoice2}`}>HOUR - 14:18 PM</div>
                         <div className={`${styles.hippo_tpl004_table_row + ' ' + styles.hippo_tpl004_bg_gray_1000}`}>SITUATION</div>
                         <div className={`${styles.hippo_tpl004_table_row + ' ' + styles.hippo_tpl004_bg_gray_1000 + ' ' + styles.hippo_tpl004_text_gray_1200}`}>UNPAID</div>
                    </div>
               </div>
          </div>
          <div className={styles.hippo_tpl004_invoice_wrapper}>
               <table className={styles.hippo_tpl004_invoice_table2}>
                    <thead>
                         <tr className={styles.hippo_tpl004_invoice_header2}>
                              <th className={styles.hippo_tpl004_box}><span className={styles.hippo_tpl007_box}></span></th>
                              <th className={styles.hippo_tpl004_invoice_col_description}>ITEM DESCRIPTION</th>
                              <th className={styles.hippo_tpl004_invoice_col_price}>UNIT PRICE</th>
                              <th className={styles.hippo_tpl004_invoice_col_qty}>QUANTITY</th>
                              <th className={styles.hippo_tpl004_invoice_col_total}>TOTAL PRICE</th>
                         </tr>
                    </thead>
                    <tbody>
                         {data.map((item, index) => (
                              <tr
                                   key={item.id}
                                   className={`${styles.hippo_tpl004_invoice_row} ${index % 2 === 0
                                        ? styles.hippo_tpl004_invoice_row_even
                                        : styles.hippo_tpl004_invoice_row_odd
                                        }`}
                              >
                                   <td className={styles.hippo_tpl004_box}></td>
                                   <td className={styles.hippo_tpl004_invoice_col_description}>
                                        <div className={styles.hippo_tpl004_invoice_item}>
                                             <div className={styles.hippo_tpl004_invoice_number2}>{item.id}</div>
                                             <div className={styles.hippo_tpl004_flex_1}>
                                                  <div className={styles.hippo_tpl004_invoice_title}>{item.title}</div>
                                                  <div className={styles.hippo_tpl004_invoice_desc}>
                                                       Phasellus in urna venenatis, fermentum erat in,<br></br> tincidunt lorem. Aliquam nulla tellus.
                                                  </div>
                                             </div>
                                        </div>
                                   </td>
                                   <td className={styles.hippo_tpl004_invoice_col_price}>
                                        <div className={styles.hippo_tpl004_invoice_title}>
                                             {item.unitPrice} $ (US)
                                        </div>
                                        <div className={styles.hippo_tpl004_invoice_desc}>
                                             <span>2<br></br>2</span>
                                        </div>
                                   </td>
                                   <td className={styles.hippo_tpl004_invoice_col_qty}>
                                        <div className={styles.hippo_tpl004_invoice_title}>
                                             {item.quantity}
                                        </div>
                                        <div className={styles.hippo_tpl004_invoice_desc}>
                                             <span>2<br></br>2</span>
                                        </div>
                                   </td>
                                   <td className={styles.hippo_tpl004_invoice_col_total}>
                                        <div className={styles.hippo_tpl004_invoice_title}>
                                             {item.unitPrice * item.quantity} $ (US)
                                        </div>
                                        <div className={styles.hippo_tpl004_invoice_desc}>
                                             <span>2<br></br>2</span>
                                        </div>
                                   </td>
                              </tr>
                         ))}
                    </tbody>
               </table>
          </div>
          <div className={styles.hippo_tpl004_totalsWrapper}>
               <div className={styles.hippo_tpl004_paymentBox}>
                    <div className={styles.hippo_tpl004_paymentborder}>
                         <p className={styles.hippo_tpl004_paymentLabel}>PAYMENT METHODS
                              <br></br>
                              <span>PAYMENT METHOD GOES HERE    <br></br>
                                   ANOTHER PAYMENT METHOD GOES HERE
                              </span>
                         </p>
                         <p className={styles.hippo_tpl004_paymentLabel}>Terms and Conditions
                              <br></br>
                              <span>Phasellus in urna venenatis, fermentum erat in, tincidunt lorem.<br></br>
                                   Aliquam nulla tellus.
                              </span>
                         </p>
                         <h6>Thank you for your business.</h6>
                    </div>
               </div>

               <table className={styles.hippo_tpl004_totalTable}>
                    <tbody>
                         <tr>
                              <td className={styles.hippo_tpl004_totalLabel}>Sub Total</td>
                              <td className={styles.hippo_tpl004_totalValue}>$5150.00</td>
                         </tr>
                         <tr className={styles.hippo_tpl004_totalLabelbg}>
                              <td className={styles.hippo_tpl004_totalLabel}>Tax: VAT 10% </td>
                              <td className={styles.hippo_tpl004_totalValue}>$515.00</td>
                         </tr>
                         <tr>
                              <td className={styles.hippo_tpl004_totalLabel}>Discount 5%</td>
                              <td className={styles.hippo_tpl004_totalValue}>$260.00</td>
                         </tr>
                         <tr className={styles.hippo_tpl004_totalRow}>
                              <td className={styles.hippo_tpl004_totalText}>GRAND TOTAL  </td>
                              <td className={styles.hippo_tpl004_totalAmount}>$5925.00</td>
                         </tr>
                    </tbody>
               </table>
          </div>
          </div>
           
     )
}

export default Invoice2
