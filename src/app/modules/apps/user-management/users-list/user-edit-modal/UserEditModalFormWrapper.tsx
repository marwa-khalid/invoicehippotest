import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UserEditModalForm } from "./UserEditModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";
import { getUserById } from "../core/_requests";
import { getVatById } from "../core/_requests";
interface ComponentProps {
  editModalId: number;
  ledgerAccountDisplayName: string;
}
const UserEditModalFormWrapper = ({
  editModalId,
  ledgerAccountDisplayName,
}: ComponentProps) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const [vatTypeDetails, setVatTypeDetails] = useState<any>(null);
  useEffect(() => {
    const getVatTypeDetails = async () => {
      try {
        const response = await getVatById(editModalId);
        setVatTypeDetails(response);

        // setTotalItems(response.result);
      } catch (error) {
        console.error("Error fetching VAT types:", error);
      } finally {
      }
    };
    getVatTypeDetails();
  }, []);
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

  // if (!editModalId) {
  //   return (
  //     <UserEditModalForm
  //       isUserLoading={isLoading}
  //       user={{ editModalId: undefined }}
  //     />
  //   );
  // }

  // if (!isLoading && !error && user) {
  return (
    <UserEditModalForm
      isUserLoading={isLoading}
      user={vatTypeDetails}
      ledgerAccountDisplayName={ledgerAccountDisplayName}
    />
  );
  // }

  return null;
};

export { UserEditModalFormWrapper };
