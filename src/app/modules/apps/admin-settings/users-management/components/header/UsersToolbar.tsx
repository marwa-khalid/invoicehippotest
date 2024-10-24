import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import {
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { checkUsage } from "../../core/_requests";
import { handleToast } from "../../../../../auth/core/_toast";
import React, { useState } from "react";
import Tippy from "@tippyjs/react";

interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setIsLoading: (type: boolean) => void;
  setIsUpgradeAvailable: (type: boolean) => void;
}

const UsersToolbar = ({
  totalRows,
  setAddModalOpen,
  setIsLoading,
  setIsUpgradeAvailable,
}: ToolbarProps) => {
  const intl = useIntl();

  const openAddUserModal = async () => {
    setIsLoading(true);
    const response = await checkUsage();

    if (response) {
      setAddModalOpen(true);

      setIsLoading(false);
    } else {
      // Open the upgrade modal
      handleToast(response);
      setIsUpgradeAvailable(true);

      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center"
        data-kt-user-table-toolbar="base"
      >
        <h5 className="ms-5 text-muted">
          {intl
            .formatMessage({ id: "Fields.SearchResultHeaderCount" })
            .replace("{0}", totalRows.toString())}
        </h5>
        <div>
          {/* begin::Add user */}
          <Tippy
            content={intl.formatMessage({
              id: "Fields.ToolTipNew",
            })}
          >
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={openAddUserModal}
            >
              <KTIcon iconName="plus" className="fs-1" />
              {intl.formatMessage({ id: "Fields.ModalNewTitleUserProfile" })}
            </button>
          </Tippy>
        </div>
        {/* end:: Add user */}
      </div>
    </>
  );
};

export { UsersToolbar };
