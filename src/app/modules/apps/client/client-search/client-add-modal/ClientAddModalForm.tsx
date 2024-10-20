import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import { FC } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { ListLoading } from "../../../components/ListLoading";
import { ClientAddStep1 } from "./ClientAddStep1";
import { ClientAddStep2 } from "./ClientAddStep2";
import { ClientAddStep3 } from "./ClientAddStep3";
import { ClientAddStep4 } from "./ClientAddStep4";

interface FormValues {
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
    fieldType: {
      value: number;
      description: string;
      name: string;
    };
    fieldId: number;
    value: {
      asDate: string;
      asText: string;
      asMoney: number;
      asNumber: number;
      asOptions: string[];
    };
  }[];
  id: number;
  companyId: number;
  customerNr: string;
  importReference: string;
  businessName: string;
  kvkNr: string;
  btwNr: string;
  isPrivateClient: boolean;
  factoringSessionStatement: string;
  clientTypes: number[];
  financialSettings: {
    bankAccountCompanyType: number;
    accountIbanNr: string;
    accountHolderName: string;
    hasSepaMandate: boolean;
    sepaMandateDate: string;
    sepaMandateReference: string;
  };
  invoiceAndQuoteSettings: {
    defaultDeadlineDaysForPayment: number;
    defaultVatTypeId: number;
    defaultLedgerAccountId: number;
    extraCcEmailAddressesInvoice: string[];
    extraCcEmailAddressesQuotes: string[];
    costDefaultLedgerAccountId: number;
    costDefaultVatTypeId: number;
    costDefaultReference: string;
    costDefaultLineReference: string;
  };
  invoiceAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  deliveryAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  contactlist: {
    contacts: [
      {
        id: 0;
        clientId: 0;
        isDefaultContact: true;
        firstName: "";
        betweenName: "";
        lastName: "";
        addressingType: 0;
        emailAddress: "";
        phoneNr: "";
        mobileNr: "";
        department: "";
      }
    ];
    listOfDeletedClientContactIDs: [0];
  };
}

type Props = {
  formik: any;

  isSubmitting: boolean;
  response: any;
  setDeleteModalId: (type: number[]) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;
  deleteModalOpen: boolean;
  setIsSubmitting: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  refresh: boolean;
  setResponse: any;
};

const ClientAddModalForm: FC<Props> = ({
  setIsSubmitting,
  formik,
  refresh,
  setTitle,
  setIntlMessage,
  isSubmitting,
  response,
  setDeleteModalId,
  setDeleteModalOpen,
  setAddModalOpen,
  deleteModalOpen,
  setResponse,
}) => {
  const intl = useIntl();

  return (
    <div className="tab-content" id="myTabContent">
      <div
        className="tab-pane fade show active"
        id="kt_tab_pane_4"
        role="tabpanel"
      >
       
      </div>
      {/* {showTabs && (
        <> */}
      <div className="tab-pane fade" id="kt_tab_pane_5" role="tabpanel">
       
      </div>
      <div className="tab-pane fade" id="kt_tab_pane_6" role="tabpanel">
       
      </div>
      <div className="tab-pane fade" id="kt_tab_pane_7" role="tabpanel">
        {/* Add content for Custom Features */}
       
      </div>
      {/* </>
      )} */}
    </div>
  );
};

export { ClientAddModalForm };
