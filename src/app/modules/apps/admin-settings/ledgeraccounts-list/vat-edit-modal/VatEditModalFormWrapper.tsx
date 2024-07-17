import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { VatEditModalForm } from "./VatEditModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";

import { getUserById } from "../core/_requests";
import { getVatById } from "../core/_requests";
import { FormikProps } from "formik";
import { VatTypeByIdModel } from "../core/_models";
interface FormValues {
  id: number;
  title: string;
  value: number;
  documentGroup: number;
  ledgerAccountId: number;
  isNoneVatType: boolean;
  alwaysExclusiveOfVAT: boolean;
  showInLists: boolean;
  showOnDocuments: boolean;
}

interface ComponentProps {
  formik: FormikProps<FormValues>;
  ledgerAccounts: { value: number; label: string }[];
}
const VatEditModalFormWrapper = ({
  formik,
  ledgerAccounts,
}: ComponentProps) => {
  // if (!editModalId) {
  //   return (
  //     <UserEditModalForm
  //       isUserLoading={isLoading}
  //       user={{ editModalId: undefined }}
  //     />
  //   );
  // }

  // if (!isLoading && !error && user) {
  return <VatEditModalForm formik={formik} ledgerAccounts={ledgerAccounts} />;
  // }

  return null;
};

export { VatEditModalFormWrapper };
