import { useIntl } from "react-intl";
import { KTIcon } from "../../../../helpers";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarMenuMain = () => {
  const intl = useIntl();
  const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);
  console.log(currentQuote);
  return (
    <div className="fs-xl fw-bold" style={{ marginBottom: "20px" }}>
      <div className="menu-item">
        <div className="menu-content pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            start
          </span>
        </div>
      </div>
      <SidebarMenuItem
        to="/dashboard"
        icon="ki-outline ki-home"
        title={intl.formatMessage({ id: "Menu.Dashboard" })}
        fontIcon="bi-app-indicator"
      />
      <SidebarMenuItem
        to="/client/search"
        icon="switch"
        title="Clients"
        fontIcon="bi-layers"
      />
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            sales
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/invoice/search"
        title="Invoices"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem to="/error" title="new invoice" hasBullet={true} />
        <SidebarMenuItem
          to="/invoice/search"
          title="overview"
          hasBullet={true}
        />
        <SidebarMenuItem to="/error" title="subscriptions" hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/estimation/search"
        title="Estimations"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem to="/error" title="new estimation" hasBullet={true} />
        <SidebarMenuItem
          to="/estimation/search"
          title="overview"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to="/admin/productgroups"
        title="Products"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/product/search"
          title="overview"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/admin/productgroups"
          title="productgroups"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/admin/unit-types"
        title="Settings"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/admin/unit-types"
          title="Unit Types"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/admin/discounts"
          title="Discount Margins"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/admin/notification-cycle"
          title="Reminder Settings"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            settings
          </span>
        </div>
      </div>
      <SidebarMenuItem
        to="/admin/ledgeraccount"
        title="Ledger Accounts"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
        to="/admin/vattype"
        title="Tax Types"
      />
      <SidebarMenuItem
        to="/admin/financialaccount"
        title="Financial Accounts"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/admin/customfields"
        title="Custom Fields"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />

      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            me & company
          </span>
        </div>
      </div>

      <SidebarMenuItem
        to="/error"
        title="my company"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/error"
        title="company tradenames"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/admin/settings/users"
        title="users"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/invoice/search"
        title="my invoices"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      <SidebarMenuItem
        to="/error"
        title="my subscriptions"
        icon="ki-outline ki-home"
        fontIcon="bi-layers"
      />
      {/* </>
      )} */}
      {/* <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Crafted
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/crafted/pages"
        title="Pages"
        fontIcon="bi-archive"
        icon="element-plus"
      >
        <SidebarMenuItemWithSub
          to="/crafted/pages/profile"
          title="Profile"
          hasBullet={true}
        >
          <SidebarMenuItem
            to="/crafted/pages/profile/overview"
            title="Overview"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/projects"
            title="Projects"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/campaigns"
            title="Campaigns"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/documents"
            title="Documents"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/profile/connections"
            title="Connections"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub
          to="/crafted/pages/wizards"
          title="Wizards"
          hasBullet={true}
        >
          <SidebarMenuItem
            to="/crafted/pages/wizards/horizontal"
            title="Horizontal"
            hasBullet={true}
          />
          <SidebarMenuItem
            to="/crafted/pages/wizards/vertical"
            title="Vertical"
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/crafted/accounts"
        title="Accounts"
        icon="profile-circle"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/crafted/account/overview"
          title="Overview"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/account/settings"
          title="Settings"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/error"
        title="Errors"
        fontIcon="bi-sticky"
        icon="cross-circle"
      >
        <SidebarMenuItem to="/error/404" title="Error 404" hasBullet={true} />
        <SidebarMenuItem to="/error/500" title="Error 500" hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/crafted/widgets"
        title="Widgets"
        icon="element-7"
        fontIcon="bi-layers"
      >
        <SidebarMenuItem
          to="/crafted/widgets/lists"
          title="Lists"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/statistics"
          title="Statistics"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/charts"
          title="Charts"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/mixed"
          title="Mixed"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/tables"
          title="Tables"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/crafted/widgets/feeds"
          title="Feeds"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <div className="menu-item">
        <div className="menu-content pt-8 pb-2">
          <span className="menu-section text-muted text-uppercase fs-8 ls-1">
            Apps
          </span>
        </div>
      </div>
      <SidebarMenuItemWithSub
        to="/apps/chat"
        title="Chat"
        fontIcon="bi-chat-left"
        icon="message-text-2"
      >
        <SidebarMenuItem
          to="/apps/chat/private-chat"
          title="Private Chat"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/apps/chat/group-chat"
          title="Group Chart"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/apps/chat/drawer-chat"
          title="Drawer Chart"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to="/apps/user-management/users"
        icon="abstract-28"
        title="User management"
        fontIcon="bi-layers"
      />
      <div className="menu-item">
        <a
          target="_blank"
          className="menu-link"
          href={import.meta.env.VITE_APP_PREVIEW_DOCS_URL + "/changelog"}
        >
          <span className="menu-icon">
            <KTIcon iconName="code" className="fs-2" />
          </span>
          <span className="menu-title">
            Changelog {import.meta.env.VITE_APP_VERSION}
          </span>
        </a>
      </div> */}
    </div>
  );
};

export { SidebarMenuMain };
