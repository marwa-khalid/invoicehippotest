import { useIntl } from "react-intl";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";
import clsx from "clsx";
import { useAuth } from "../../../../../app/modules/auth";

const SidebarMenuMain = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  return (
    <>
      <SidebarMenuItem
        to="/dashboard"
        icon="element-11"
        title={intl.formatMessage({ id: "Menu.Dashboard" })}
        fontIcon="bi-app-indicator"
      />

      <SidebarMenuItemWithSub
        to="/inbox"
        title="Inbox"
        fontIcon="bi-archive"
        icon="receipt-square"
      >
        <SidebarMenuItem
          to="/inbox/search"
          title="Attachments & Receipts Inbox"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/inbox/archive"
          title="Attachments Archive"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span
            className={clsx(
              "menu-section text-uppercase fs-8 ls-1",
              !currentUser?.result.isInTakeOverMode
                ? "text-white"
                : "text-muted"
            )}
          >
            {intl.formatMessage({
              id: "Menu.HeaderCustomers",
            })}
          </span>
        </div>
      </div>
      <SidebarMenuItem
        to="/client/search"
        icon="user"
        title={intl.formatMessage({
          id: "Menu.HeaderCustomers",
        })}
        fontIcon="bi-layers"
      />

      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span
            className={clsx(
              "menu-section text-uppercase fs-8 ls-1",
              !currentUser?.result.isInTakeOverMode
                ? "text-white"
                : "text-muted"
            )}
          >
            {intl.formatMessage({
              id: "Menu.HeaderSales",
            })}
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/invoice"
        title={intl.formatMessage({
          id: "Menu.Invoices",
        })}
        icon="receipt-square"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/invoice/search"
          title={intl.formatMessage({
            id: "Menu.InvoicesOverview",
          })}
          hasBullet={true}
        />

        <SidebarMenuItem
          to="/invoice/subscriptions"
          title={intl.formatMessage({
            id: "Menu.InvoiceSubscriptions",
          })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to="/estimation/search"
        title={intl.formatMessage({
          id: "Menu.Quotes",
        })}
        icon="finance-calculator"
        fontIcon="bi-layers"
      />

      <SidebarMenuItemWithSub
        to="/admin/productgroups"
        title={intl.formatMessage({
          id: "Menu.Products",
        })}
        icon="add-item"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/product/search"
          title={intl.formatMessage({
            id: "Menu.ProductsOverview",
          })}
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/admin/productgroups"
          title={intl.formatMessage({
            id: "Menu.ProductGroups",
          })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/admin/unit-types"
        title={intl.formatMessage({
          id: "Menu.Settings",
        })}
        icon="setting-4"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/admin/unit-types"
          title={intl.formatMessage({
            id: "Menu.ProductUnits",
          })}
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/admin/discounts"
          title={intl.formatMessage({
            id: "Menu.DiscountMargins",
          })}
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/admin/notification-cycle"
          title={intl.formatMessage({
            id: "Menu.ReminderNotificationSettings",
          })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span
            className={clsx(
              "menu-section text-uppercase fs-8 ls-1",
              !currentUser?.result.isInTakeOverMode
                ? "text-white"
                : "text-muted"
            )}
          >
            {intl.formatMessage({ id: "Menu.HeaderAccounting" })}
          </span>
        </div>
      </div>
      <SidebarMenuItem
        to="/booking/search"
        title={intl.formatMessage({ id: "Menu.Bookings" })}
        icon="receipt-square"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/cost/search"
        title={intl.formatMessage({ id: "Menu.Purchases" })}
        icon="receipt-square"
        fontIcon="bi-layers"
      />
      <SidebarMenuItemWithSub
        to="/accounting"
        title={intl.formatMessage({
          id: "Fields.SearchPanelTitleBankMutation",
        })}
        icon="bank"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/accounting/transactions"
          title={intl.formatMessage({ id: "Menu.BankMutationsOverview" })}
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/accounting/routing-rule"
          title={intl.formatMessage({
            id: "Menu.BankMutationAutomationRules",
          })}
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span
            className={clsx(
              "menu-section text-uppercase fs-8 ls-1",
              !currentUser?.result.isInTakeOverMode
                ? "text-white"
                : "text-muted"
            )}
          >
            {intl.formatMessage({ id: "Menu.Settings" })}
          </span>
        </div>
      </div>
      <SidebarMenuItem
        to="/admin/ledgeraccount"
        title={intl.formatMessage({
          id: "Fields.SearchPanelTitleLedgerAccount",
        })}
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
        to="/admin/vattype"
        title={intl.formatMessage({ id: "Fields.SearchPanelTitleVatType" })}
      />
      <SidebarMenuItem
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
        to="/admin/localizations"
        title={intl.formatMessage({
          id: "Menu.SettingsLocalizations",
        })}
      />
      <SidebarMenuItem
        to="/admin/financialaccount"
        title={intl.formatMessage({
          id: "Fields.SearchPanelTitleFinancialAccount",
        })}
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/admin/customfields"
        title={intl.formatMessage({ id: "Fields.SearchPanelTitleCustomField" })}
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />

      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span
            className={clsx(
              "menu-section text-uppercase fs-8 ls-1",
              !currentUser?.result.isInTakeOverMode
                ? "text-white"
                : "text-muted"
            )}
          >
            {intl.formatMessage({ id: "Menu.HeaderCompanyAndMe" })}
          </span>
        </div>
      </div>

      <SidebarMenuItem
        to="/admin/my-company"
        title={intl.formatMessage({ id: "Settings.SideMenuMyCompany" })}
        icon="office-bag"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/admin/tradenames"
        title={intl.formatMessage({ id: "Settings.SideMenuTradeNames" })}
        icon="courier-express"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/admin/templates"
        title={intl.formatMessage({ id: "Menu.SettingsTemplates" })}
        icon="tablet-text-up"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/admin/settings/users"
        title={intl.formatMessage({ id: "Settings.SideMenuUsers" })}
        icon="ki ki-outline ki-people ms-5"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/admin/subscribers"
        title={intl.formatMessage({ id: "Settings.SideMenuSubscribers" })}
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
    </>
  );
};

export { SidebarMenuMain };
