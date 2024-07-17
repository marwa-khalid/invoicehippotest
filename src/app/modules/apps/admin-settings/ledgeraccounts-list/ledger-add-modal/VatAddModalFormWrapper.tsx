import { useQuery } from "react-query";
import { VatAddModalForm } from "./VatAddModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";
import { getUserById } from "../core/_requests";
import { FormikProps } from "formik";
import { VatTypesResult } from "../core/_models";

interface FormValues {
  id: number;
  title: string;
  code: string;
  defaultTaxTypeId: number;
  bearingType: number;
  reportReferenceType1: number;
  reportReferenceType2LegderAccountId: number;
  disableManualInput: boolean;
  taxDeductibleSettings: {
    isNotFullyTaxDeductible: boolean;
    taxDeductiblePercentage: number;
    deductiblePrivateLedgerAccountId: number;
  };
}

interface GroupedOption {
  label: any;
  options: { value: number; label: string }[];
  IsAccountTypeOmzet: boolean;
  IsAccountTypeBtw: boolean;
  IsAccountTypeCost: boolean;
  IsAccountTypeResult: boolean;
  IsAccountTypePrive: boolean;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  vatTypes: { value: number; label: string }[];
  setSelectedBearingTypeOption: (value: any) => void;
  selectedBearingTypeOption: any;
};

const VatAddModalFormWrapper = ({
  formik,
  isSubmitting,
  vatTypes,
  selectedBearingTypeOption,
  setSelectedBearingTypeOption,
}: Props) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getUserById(itemIdForUpdate);
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined);
        console.error(err);
      },
    }
  );

  if (!itemIdForUpdate) {
    return (
      <VatAddModalForm
        isUserLoading={isLoading}
        user={{ id: undefined }}
        formik={formik}
        isSubmitting={isSubmitting}
        vatTypes={vatTypes}
        selectedBearingTypeOption={selectedBearingTypeOption}
        setSelectedBearingTypeOption={setSelectedBearingTypeOption}
      />
    );
  }

  if (!isLoading && !error && user) {
    return (
      <VatAddModalForm
        isUserLoading={isLoading}
        user={user}
        formik={formik}
        isSubmitting={isSubmitting}
        vatTypes={vatTypes}
        selectedBearingTypeOption={selectedBearingTypeOption}
        setSelectedBearingTypeOption={setSelectedBearingTypeOption}
      />
    );
  }

  return null;
};

export { VatAddModalFormWrapper };
