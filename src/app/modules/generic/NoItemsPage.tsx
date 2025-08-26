import React from "react";
import PropTypes from "prop-types";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { useIntl } from "react-intl";

type NoItemsPageProps = {
  imageSrc?: string;
  altText?: string;
  messageId?: string;
};

const NoItemsPage: React.FC<NoItemsPageProps> = ({
  imageSrc,
  altText,
  messageId,
}) => {
  const intl = useIntl();

  return (
    <div className="text-center p-10">
      <img
        alt={altText || "No items available"}
        src={imageSrc || toAbsoluteUrl("media/logos/searchnotfound.png")}
        className="h-300px w-400px"
      />
      <h5 className="text-muted">
        {intl.formatMessage({
          id: messageId || "Fields.SearchNoItemsAvailableDefault",
        })}
      </h5>
    </div>
  );
};

NoItemsPage.propTypes = {
  imageSrc: PropTypes.string,
  altText: PropTypes.string,
  messageId: PropTypes.string,
};

export { NoItemsPage };
