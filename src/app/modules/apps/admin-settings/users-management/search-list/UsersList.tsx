import { useEffect, useState } from "react";
import { getUsers } from "../core/_requests";
import { UserResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { UsersPagination } from "../components/pagination/UsersPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { useAuth } from "../../../../auth";
import Tippy from "@tippyjs/react";
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
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  isLoading: boolean;
  setIsLoading: (type: boolean) => void;
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
  editModalOpen,
  deleteModalOpen,
  isLoading,
  setIsLoading,
}: ComponentProps) => {
  const [users, setUsers] = useState<any>([]);
  const auth = useAuth();
  const currentUser = auth.currentUser;
  const intl = useIntl();

  // const [pageIndex, setPageIndex] = useState<number>(1);

  const fetchUsersList = async () => {
    setIsLoading(true);

    try {
      const response = await getUsers(searchTerm, pageIndex);

      setUsers(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching all users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchUsersList();
  };

  useEffect(() => {
    fetchUsersList();
  }, [searchTerm, pageIndex, searchCounter]);

  useEffect(() => {
    fetchUsersList();
  }, [editModalOpen, deleteModalOpen, refresh]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, userName: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setUserName(userName);
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          users?.result?.map((user: UserResult) => (
            <div className="col" key={user.id}>
              <div className="card h-100 py-6 ">
                <div className="card-body">
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

                      <span className="text-muted">
                        {user.loginEmailAddress}
                      </span>
                    </div>
                    <div className="align-items-center my-lg-0 my-1 necessary-icons">
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
                      <li className="breadcrumb-item  ">
                        <small className="bg-primary p-1 px-2 rounded text-white">
                          {user.userType.description.toLowerCase()}
                        </small>
                      </li>

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
        <UsersPagination
          totalPages={users.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={users.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { UsersList };
