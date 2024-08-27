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

interface FormValues {
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
    fieldType: {
      value: number;
      description: string;
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
}

type Props = {
  formik: FormikProps<FormValues>;
  showTabs: boolean;
  isSubmitting: boolean;
  clientId: number;
  setDeleteModalId: (type: number[]) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;
  deleteModalOpen: boolean;
};

const ClientAddModalForm: FC<Props> = ({
  showTabs,
  formik,
  setTitle,
  setIntlMessage,
  isSubmitting,
  clientId,
  setDeleteModalId,
  setDeleteModalOpen,
  deleteModalOpen,
}) => {
  const intl = useIntl();

  return (
    <div className="tab-content" id="myTabContent">
      <div
        className="tab-pane fade show active"
        id="kt_tab_pane_4"
        role="tabpanel"
      >
        <ClientAddStep1 formik={formik} isSubmitting={isSubmitting} />
      </div>
      {/* {showTabs && (
        <> */}
      <div className="tab-pane fade" id="kt_tab_pane_5" role="tabpanel">
        <ClientAddStep2
          formik={formik}
          isSubmitting={isSubmitting}
          clientId={clientId}
          setDeleteModalOpen={setDeleteModalOpen}
          setDeleteModalId={setDeleteModalId}
          setIntlMessage={setIntlMessage}
          setTitle={setTitle}
          deleteModalOpen={deleteModalOpen}
        />
      </div>
      <div className="tab-pane fade" id="kt_tab_pane_6" role="tabpanel">
        <ClientAddStep3 formik={formik} isSubmitting={isSubmitting} />
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
