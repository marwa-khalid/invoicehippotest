import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Formik, Form, FormikProps } from "formik";
import { FormValues } from "./QuoteValidateStep1";
import { useIntl } from "react-intl";

type Props = {
  formik: FormikProps<FormValues>;
};

const DigitalSignature = ({ formik }: Props) => {
  const sigCanvas = useRef<any>(null);
  const [signatureType, setSignatureType] = useState<any>("draw");
  const [typedSignature, setTypedSignature] = useState<any>("");
  const [image, setImage] = useState<any>(null);
  const [fontFamily, setFontFamily] = useState<any>("Arial");
  const [savedSignature, setSavedSignature] = useState<any>(null); // State to store the drawn signature

  const fonts = [
    "Arial",
    "Brush Script MT",
    "Courier New",
    "Georgia",
    "Times New Roman",
  ];

  // Function to clear the drawn signature
  const clearSignature = () => {
    sigCanvas.current.clear();
    setSavedSignature(null); // Reset saved signature when cleared
  };
  console.log(savedSignature);
  useEffect(() => {
    let signatureData;
    if (signatureType === "draw") {
      signatureData = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      setSavedSignature(signatureData); // Save the drawn signature
    } else if (signatureType === "type") {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 400; // Set width
      canvas.height = 200; // Set height
      context!.font = `40px ${fontFamily}`;
      context!.fillText(typedSignature, 10, 100); // Position the text
      signatureData = canvas.toDataURL("image/png");
    } else if (signatureType === "upload" && image) {
      signatureData = image; // If image is a URL, use it directly.
    }

    // Store the Base64 string in Formik values
    if (signatureData) {
      formik.setFieldValue(
        "quoteValidationSignee.validatedBySignatureBase64",
        signatureData
      );
      console.log("Saved Signature Base64:", signatureData); // Handle the saved signature data
    }
  }, [sigCanvas]);
  // Function to save the signature (drawn, typed, or uploaded)
  const saveSignature = (setFieldValue: any) => {};

  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store the Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Restore the saved signature if switching back to "draw"
    if (signatureType === "draw" && savedSignature) {
      const img = new Image();
      img.src = savedSignature;
      img.onload = () => {
        const context = sigCanvas.current.getCanvas().getContext("2d");
        context.drawImage(img, 0, 0); // Draw the saved signature on the canvas
      };
    }
  }, [signatureType, savedSignature]); // Trigger when signatureType or savedSignature changes
  const intl = useIntl();
  return (
    <div>
      <form>
        <h2>
          {intl.formatMessage({
            id: "Fields.Signature",
          })}
        </h2>

        <div className="d-flex gap-4 justify-content-center">
          <div className="form-check form-check-custom form-check-solid">
            <input
              type="radio"
              className="form-check-input cursor-pointer"
              name="signatureType"
              value="draw"
              checked={signatureType === "draw"}
              onChange={() => setSignatureType("draw")}
            />
            <label className="form-check-label">
              {intl.formatMessage({
                id: "Fields.SigningOptionDraw",
              })}
            </label>
          </div>

          <div className="form-check form-check-custom form-check-solid">
            <input
              type="radio"
              name="signatureType"
              className="form-check-input cursor-pointer"
              value="type"
              checked={signatureType === "type"}
              onChange={() => setSignatureType("type")}
            />
            <label className="form-check-label">
              {intl.formatMessage({
                id: "Fields.SigningOptionTyping",
              })}
            </label>
          </div>
          <div className="form-check form-check-custom form-check-solid">
            <input
              type="radio"
              name="signatureType"
              value="upload"
              className="form-check-input cursor-pointer"
              checked={signatureType === "upload"}
              onChange={() => setSignatureType("upload")}
            />
            <label className="form-check-label">
              {intl.formatMessage({
                id: "Fields.SigningOptionUpload",
              })}
            </label>
          </div>
        </div>

        <div style={{ marginTop: "20px" }} className="text-center">
          {signatureType === "draw" && (
            <div
              className="mx-auto"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                width: "fit-content",
              }}
            >
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                backgroundColor="#dddddd"
                canvasProps={{
                  width: 400,
                  height: 200,
                  className: "sigCanvas rounded",
                }}
              />
              <button
                className="btn btn-danger btn-sm mt-3"
                onClick={() => clearSignature()}
              >
                <i className="fa fa-x fs-3 p-0 m-0" />
              </button>
            </div>
          )}

          {signatureType === "type" && (
            <div className="mt-10">
              <input
                type="text"
                className="form-control form-control-solid w-50 mx-auto fs-2"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Type your signature"
                style={{
                  fontFamily: fontFamily,
                }}
              />
              <div className="flex mt-10">
                {fonts.map((font) => (
                  <span
                    className="me-3 p-3 cursor-pointer rounded"
                    key={font}
                    onClick={() => setFontFamily(font)}
                    style={{
                      fontFamily: font,
                      border:
                        fontFamily === font
                          ? "1px solid #1086ff"
                          : "1px solid gray",
                    }}
                  >
                    {font}
                  </span>
                ))}
              </div>
            </div>
          )}

          {signatureType === "upload" && (
            <div className="fv-row">
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                className="d-none" // Hides the input element
                onChange={handleUpload}
              />
              <label htmlFor="fileInput">
                <div className="dropzone" id="kt_dropzonejs_example_1">
                  <div className="dz-message needsclick">
                    <i className="ki-duotone ki-file-up fs-3x text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                    <div className="ms-4 mt-2">
                      <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                        {intl.formatMessage({
                          id: "Fields.FileManagerUploadSingleFile",
                        })}
                      </h3>
                    </div>
                  </div>
                </div>
              </label>
              {image && (
                <div className="mt-3">
                  <img
                    src={image}
                    alt="Uploaded preview"
                    style={{
                      width: "200px",
                      height: "150px",
                      objectFit: "cover",
                    }} // Set custom width and height
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Button to save the signature and trigger Formik submission */}
        {/* <div className="text-end">
            <button
              type="button"
              onClick={() => saveSignature(setFieldValue)}
              className="btn btn-primary mt-4"
            >
              Save Signature
            </button>
          </div> */}
      </form>
    </div>
  );
};

export { DigitalSignature };
