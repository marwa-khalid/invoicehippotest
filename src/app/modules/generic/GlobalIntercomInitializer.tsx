// GlobalIntercomInitializer.tsx
import { useEffect } from "react";
import IntercomService from "./IntercomService";
import { useAuth } from "../auth";

const GlobalIntercomInitializer = () => {
  const { currentUser } = useAuth(); // however you store user

  useEffect(() => {
    if (currentUser) {
      IntercomService.boot({
        app_id: "ypc4i8s9",
        name: currentUser.result.displayName,
        email: currentUser.result.emailAddress,
        user_id: currentUser.result.id,
        subscriber_id: currentUser.result.subscriberId,
        alignment: "left",
        company: currentUser.result.activeCompany.title,
        company_name: currentUser.result.activeCompany.title,
        company_id: currentUser.result.activeCompany.id,
        user_hash: currentUser.result.thirdPartySettings.userIntercomIoHash,
        is_takeover: currentUser.result.switches.isInTakeOverMode,
        is_anonymous_client: currentUser.result.isAnonymousUser,
        license_name: currentUser.result.activeLicense.licenseType.name,
        license_type: currentUser.result.activeLicense.licenseType.value,
        license_trialIsExpiring:
          currentUser.result.activeLicense.trialIsExpiring,
        license_daysLeftToExpiration:
          currentUser.result.activeLicense.daysLeftToExpiration,
        license_licenseIsExpiring:
          currentUser.result.activeLicense.licenseIsExpiring,
        license_isActive: currentUser.result.activeLicense.isActive,
      });
    } else {
      IntercomService.boot(); // Just app_id
    }
  }, [currentUser]);

  return null;
};

export default GlobalIntercomInitializer;
