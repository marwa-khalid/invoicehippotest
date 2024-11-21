import * as Yup from "yup";

export interface ICreateAccount {
  companyName: string;
  kvknr: string;
  btwnr: string;
  firstName: string;
  betweenName: string;
  lastName: string;
  ibanNumber: string;
  emailAddress: string;
  isBusiness: boolean;
}

const createAccountSchemas = [
  Yup.object().shape({
    companyName: Yup.string().when("isBusiness", {
      is: true,
      then: (schema) =>
        schema.required("Company Name is required for businesses"),
      otherwise: (schema) => schema.optional(), // Not required if not a business
    }),
    kvkNumber: Yup.string().label("KVK Number"),
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
  companyName: "", // Only for business accounts
  kvknr: "", // Company registration number
  btwnr: "", // Tax identification number
  firstName: "",
  betweenName: "", // Optional field
  lastName: "",
  ibanNumber: "", // Example IBAN
  emailAddress: "",
  isBusiness: false,
};

export { createAccountSchemas, inits };
