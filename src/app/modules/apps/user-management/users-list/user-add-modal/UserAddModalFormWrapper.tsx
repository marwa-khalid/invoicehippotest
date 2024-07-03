import { useQuery } from "react-query";
import { UserAddModalForm } from "./UserAddModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";
import { getUserById } from "../core/_requests";
import { FormikProps } from "formik";
import { VatTypesResult } from "../core/_models";

interface FormValues {
  id: number;
  title: string;
  value: number;
  documentGroup: string;
  ledgerAccountId: number;
  isNoneVatType: boolean;
  alwaysExclusiveOfVAT: boolean;
  showInLists: boolean;
  showOnDocuments: boolean;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  ledgerAccounts: { value: number; label: string }[];
};

const UserAddModalFormWrapper = ({
  formik,
  isSubmitting,
  ledgerAccounts,
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
      <UserAddModalForm
        isUserLoading={isLoading}
        user={{ id: undefined }}
        formik={formik}
        isSubmitting={isSubmitting}
        ledgerAccounts={ledgerAccounts}
      />
    );
  }

  if (!isLoading && !error && user) {
    return (
      <UserAddModalForm
        isUserLoading={isLoading}
        user={user}
        formik={formik}
        isSubmitting={isSubmitting}
        ledgerAccounts={ledgerAccounts}
      />
    );
  }

  return null;
};

export { UserAddModalFormWrapper };
