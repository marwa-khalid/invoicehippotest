// src/components/BootstrapModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useIntl } from "react-intl";
interface Props {
  show: boolean;
  handleClose: () => void;
  companyName: string;
}

const ConditionsModal: React.FC<Props> = ({
  show,
  handleClose,
  companyName,
}) => {
  const intl = useIntl();
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-primary">
        <Modal.Title className=" text-white">
          {intl.formatMessage({
            id: "LOGINANDREGISTRATION.SEPASTEP3MODALTITLE",
          })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p
          className="text-gray-500 "
          dangerouslySetInnerHTML={{
            __html: intl
              .formatMessage({
                id: "LOGINANDREGISTRATION.SEPAACCEPTTERMSANDCONDITIONS",
              })
              .replace(/{0}/g, `<strong>${companyName}</strong>`),
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn btn-light-primary" onClick={handleClose}>
          {intl.formatMessage({
            id: "FIELDS.ACTIONCLOSE",
          })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ConditionsModal };
