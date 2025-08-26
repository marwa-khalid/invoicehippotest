import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { CompaniesTab } from "./components/CompaniesTab";
import { SubscriberTab } from "./components/SubscriberTab";
import { DetailPageHeader } from "./DetailPageHeader";
import { useFormik } from "formik";
import {
  getSubscriberById,
  getSubscriberUsageQuotas,
  postSubscriberDetail,
} from "../core/_requests";
import { useParams } from "react-router-dom";
import { BillingTab } from "./components/BillingTab";
import { handleToast } from "../../../auth/core/_toast";
import { ListLoading } from "../../../generic/ListLoading";
import { useIntl } from "react-intl";
import * as Yup from "yup";
const DetailPage: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      id: 0,
      billingContact: {
        genderType: 0,
        firstName: "",
        betweenName: "",
        lastName: "",
        phoneNr: "",
        mobileNr: "",
        emailAddress: "",
      },
      billingAddress: {
        street: "",
        houseNr: "",
        houseNrAddon: "",
        postCode: "",
        city: "",
        state: "",
        countryType: 0,
      },
      financialAccount: {
        billingCompanyName: "",
        billingCompanyVatNr: "",
        billingAccountNrIBANValidated: true,
        billingAccountHolderName: "",
        billingAccountNrIBAN: "",
        billingBankAccountCompanyType: 0,
      },
      isActive: true,
      isValidated: true,
      isNewSubscriber: true,
      hasFinishedInitialSetup: true,
      canUseOcrApi: true,
      registrationDate: "",
      registrationDateAsString: "",
      apiUniqueId: "",
      promotionCode: {
        code: "",
        title: "",
        description: "",
      },
      companies: [
        {
          name: "",
          id: 0,
          logoUrl: "",
          hasLogoUrl: true,
        },
      ],
    },

    validationSchema: Yup.object().shape({
      // Billing Contact
      billingContact: Yup.object().shape({
        genderType: Yup.number().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.GenderType" }))
        ),
        firstName: Yup.string()
          .min(
            3,
            intl
              .formatMessage({ id: "Common.ValidationMin" })
              .replace("{0}", intl.formatMessage({ id: "Fields.FirstName" }))
              .replace("{1}", "3")
          )
          .max(
            50,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.FirstName" }))
              .replace("{1}", "50")
          )
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.FirstName" }))
          ),
        betweenName: Yup.number().max(
          15,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.BetweenName" }))
            .replace("{1}", "15")
        ),
        lastName: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.LastName" }))
          )
          .min(
            3,
            intl
              .formatMessage({ id: "Common.ValidationMin" })
              .replace("{0}", intl.formatMessage({ id: "Fields.LastName" }))
              .replace("{1}", "3")
          )
          .max(
            50,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.LastName" }))
              .replace("{1}", "50")
          ),
        phoneNr: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.PhoneNr" }))
          )
          .max(
            20,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.PhoneNr" }))
              .replace("{1}", "20")
          ),
        mobileNr: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.MobileNr" }))
          )
          .max(
            20,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.MobileNr" }))
              .replace("{1}", "20")
          ),
        emailAddress: Yup.string()
          .email(
            intl
              .formatMessage({ id: "Common.InvalidFormat" })
              .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
          )
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
          )
          .max(
            150,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
              .replace("{1}", "150")
          ),
      }),

      // Billing Address
      billingAddress: Yup.object().shape({
        street: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.Street" }))
          )
          .max(
            50,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.Street" }))
              .replace("{1}", "50")
          ),
        houseNr: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.HouseNr" }))
          )
          .max(
            8,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.HouseNr" }))
              .replace("{1}", "8")
          ),
        houseNrAddon: Yup.string()
          .min(
            3,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.HouseNrAddon" }))
              .replace("{1}", "3")
          )
          .max(
            5,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.HouseNrAddon" }))
              .replace("{1}", "5")
          ),
        postCode: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.PostCode" }))
          )
          .max(
            10,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.HouseNrAddon" }))
              .replace("{1}", "10")
          ),
        city: Yup.string()
          .required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.City" }))
          )
          .max(
            50,
            intl
              .formatMessage({ id: "Common.ValidationMax" })
              .replace("{0}", intl.formatMessage({ id: "Fields.HouseNrAddon" }))
              .replace("{1}", "50")
          ),
        // state: Yup.string().required(
        //   intl
        //     .formatMessage({ id: "Common.RequiredFieldHint2" })
        //     .replace("{0}", intl.formatMessage({ id: "Fields.State" }))
        // ),
        countryType: Yup.number().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Country" }))
        ),
      }),

      // Financial Account
      financialAccount: Yup.object().shape({
        billingCompanyName: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
        ),
        billingCompanyVatNr: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.BtwNr" }))
        ),
        billingAccountHolderName: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.AccountHolderName" })
            )
        ),
        billingAccountNrIBAN: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
        ),
        // .matches(
        //   /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
        //   intl
        //     .formatMessage({ id: "Common.InvalidFormat" })
        //     .replace(
        //       "{0}",
        //       intl.formatMessage({ id: "Fields.AccountNrIBAN" })
        //     )
        // )
        billingBankAccountCompanyType: Yup.number().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.BankAccountCompanyType" })
            )
        ),
      }),
    }),

    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await postSubscriberDetail(values);
        if (!response.hasErrors) {
          setRefresh(!refresh);
        }

        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usage, setUsage] = useState();
  const { uniqueId } = useParams();
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        let res;
        let res2;
        if (uniqueId) {
          res = await getSubscriberById(uniqueId);
          res2 = await getSubscriberUsageQuotas(uniqueId);
        } else {
          return;
        }
        formik.setValues(res.result);
        setUsage(res2.result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [uniqueId]);

  return (
    <>
      <DetailPageHeader formik={formik} usage={usage} />
      <Outlet />
      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="subscriber_tab"
          role="tabpanel"
        >
          <SubscriberTab formik={formik} isLoading={isLoading} />
        </div>
        <div className="tab-pane fade" id="companies_tab" role="tabpanel">
          <CompaniesTab usage={usage} />
        </div>
        <div className="tab-pane fade" id="billing_tab" role="tabpanel">
          <BillingTab id={formik.values.id} />
        </div>
      </div>
      {isLoading && <ListLoading />}
    </>
  );
};

export default DetailPage;
