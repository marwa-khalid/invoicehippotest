import * as Yup from "yup";

export interface ICreateAccount {
  companyName?: string;
  kvknr?: string;
  btwnr?: string;
  firstName: string;
  betweenName?: string;
  lastName: string;
  ibanNumber: string;
  emailAddress: string;
}

const createAccountSchemas = [
  // Step 2: Business and Personal Information
  Yup.object().shape({
    companyName: Yup.string()
      .required("Company Name is required for businesses")
      .label("Company Name"),
    kvkNumber: Yup.string()
      .required("KVK Number is required for businesses")
      .label("KVK Number"),
    btwNumber: Yup.string().label("BTW Number"),
    firstName: Yup.string()
      .required("First Name is required")
      .label("First Name"),
    betweenName: Yup.string().label("Between Name"),
    lastName: Yup.string().required("Last Name is required").label("Last Name"),
    ibanNumber: Yup.string()
      .required("IBAN is required")
      .matches(
        /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
        "Invalid IBAN format"
      )
      .label("IBAN"),
    emailAddress: Yup.string()
      .email("Invalid email address format")
      .label("Email Address")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("E-mail is vereist"),
  }),
];

const inits: ICreateAccount = {
  companyName: "Keenthemes Inc.", // Only for business accounts
  kvknr: "12345678", // Company registration number
  btwnr: "NL123456789B01", // Tax identification number
  firstName: "John",
  betweenName: "", // Optional field
  lastName: "Doe",
  ibanNumber: "NL91ABNA0417164300", // Example IBAN
  emailAddress: "john.doe@example.com",
};


export { createAccountSchemas, inits };
