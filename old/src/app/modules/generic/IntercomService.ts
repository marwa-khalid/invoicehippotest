class IntercomService {
  static boot(user?: {
    app_id: string;
    name?: string;
    email?: string;
    user_id?: number;
    subscriber_id?: number;
    alignment?: string;
    company?: string;
    company_name?: string;
    company_id?: number;
    user_hash?: string;
    is_takeover?: boolean;
    is_anonymous_client?: boolean;
    license_name?: string;
    license_type?: number;
    license_trialIsExpiring?: boolean;
    license_daysLeftToExpiration?: number;
    license_licenseIsExpiring?: boolean;
    license_isActive?: boolean;
  }) {
    if (window.Intercom) {
      const settings = user
        ? {
            ...window.intercomSettings,
            ...user,
            user_active_company_id: user.company_id,
          }
        : {
            app_id: "ypc4i8s9", // fallback for login page
          };

      window.Intercom("boot", settings);
    }
  }

  static update() {
    window.Intercom?.("update");
  }

  static shutdown() {
    window.Intercom?.("shutdown");
  }
}

export default IntercomService;
