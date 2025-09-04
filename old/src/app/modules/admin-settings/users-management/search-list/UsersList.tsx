import { useEffect, useState } from "react";
import { getUsers } from "../core/_requests";
import { UserResult } from "../core/_models";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../generic/ListPagination";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
interface ComponentProps {
  searchTerm: string;
  searchCounter: number;
  setTotalRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setUserName: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  isLoading: boolean;
  setIsLoading: (type: boolean) => void;
  setProfileModalOpen: (type: boolean) => void;
  setTargetUserId: (type: number) => void;
}
const UsersList = ({
  searchTerm,
  setTotalRows,
  searchCounter,
  setEditModalOpen,
  setEditModalId,
  setUserName,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  isLoading,
  setIsLoading,
  setProfileModalOpen,
  setTargetUserId,
}: ComponentProps) => {
  const [users, setUsers] = useState<any>([]);
  const auth = useAuth();
  const currentUser = auth.currentUser;
  const intl = useIntl();

  const fetchUsersList = async () => {
    setIsLoading(true);

    try {
      const response = await getUsers(searchTerm, pageIndex);
      if (response.isValid) {
        setUsers(response);
        setTotalRows(response.totalRows);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    fetchUsersList();
  }, [searchTerm, pageIndex, searchCounter, refresh]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, userName: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setUserName(userName);
  };

  const openChangePasswordModal = (user: any) => {
    setProfileModalOpen(true);
    setTargetUserId(user.id);
  };
  return (
    <KTCardBody className="mt-7">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          users?.result?.map((user: UserResult) => (
            <div className="card" key={user.id}>
              <div className="card-body pt-4 pb-2">
                {/* First Row: Checkbox, Divider, Value */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="d-flex align-items-center gap-3 cursor-pointer title-clickable"
                    onClick={() => {
                      openEditModal(user.id);
                    }}
                  >
                    <i className="ki-duotone ki-sms text-primary fs-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>

                    <span className="text-muted">{user.loginEmailAddress}</span>
                  </div>
                  <div className="align-items-center my-lg-0 my-1 necessary-icons">
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ActionSetPassword",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-4"
                        onClick={() => {
                          openChangePasswordModal(user);
                        }}
                      >
                        <KTSVG
                          className="svg-icon svg-icon-1"
                          path="media/icons/hugeicons/reset-password.svg"
                        />
                      </button>
                    </Tippy>

                    {user.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(user.id);
                          }}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2 " />
                        </button>
                      </Tippy>
                    )}

                    {user.actions.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() => {
                            openDeleteModal(user.id, user.fullName);
                          }}
                        >
                          <i className="ki-solid ki-trash text-danger fs-2"></i>
                        </button>
                      </Tippy>
                    )}
                  </div>
                </div>
                {user.fullName && (
                  <div className="row">
                    <div className="d-flex align-items-center gap-3 cursor-pointer title-clickable mb-4">
                      {currentUser?.result.id === user.id ? (
                        <i className="ki-duotone ki-user-tick text-success fs-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      ) : (
                        <i className="ki-duotone ki-user fs-1 text-primary">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      )}
                      <strong>{user.fullName}</strong>
                    </div>
                  </div>
                )}
                {/* separator Line */}
                <div className="separator separator-solid mb-3"></div>

                <div className="mb-4 text-muted">
                  <ul className="breadcrumb breadcrumb-black breadcrumb-dot">
                    {user.userType.value && (
                      <li className="breadcrumb-item">
                        <small className="bg-primary p-1 px-2 rounded text-white">
                          {getEnumOptions(enums.UserTypes, intl)
                            .find((item) => item.value === user.userType.value)
                            ?.label.toLowerCase()}
                        </small>
                      </li>
                    )}
                    <li className="breadcrumb-item align-items-center bg-secondary ms-2 p-1 px-2 rounded">
                      <i className="ki-duotone ki-office-bag text-dark fs-2 me-2">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                      </i>
                      <small>
                        {user.companies.map((company) => {
                          return company.title;
                        })}
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        }

        {users?.result?.length == 0 && (
          <div className="text-center">
            <img
              alt=""
              src={toAbsoluteUrl("media/logos/searchnotfound.png")}
              className="h-350px w-450px"
            />
            <h3>
              {intl.formatMessage({
                id: "Fields.SearchNoItemsAvailableDefault",
              })}
            </h3>
          </div>
        )}
        {isLoading && <ListLoading />}
      </div>

      {users?.result?.length > 0 && (
        <ListPagination
          totalPages={users.totalPages}
          pageIndex={pageIndex}
          moduleName="users-module"
          onPageChange={handlePageChange}
          totalItems={users.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { UsersList };
