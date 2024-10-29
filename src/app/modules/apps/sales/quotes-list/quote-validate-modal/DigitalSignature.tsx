import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const DigitalSignature = () => {
  const [signatureType, setSignatureType] = useState<any>("draw"); // Track the selected option
  const [typedSignature, setTypedSignature] = useState<any>("");
  const [uploadedSignature, setUploadedSignature] = useState<any>(null);
  const sigCanvas = useRef<any>(null);
  const [fontFamily, setFontFamily] = useState<any>("Arial");
  const fonts = [
    "Arial",
    "Brush Script MT",
    "Courier New",
    "Georgia",
    "Times New Roman",
  ];

  // Function to clear the drawn signature
  const clearSignature = () => sigCanvas.current.clear();

  // Handle file upload
  // const handleUpload = (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => setUploadedSignature(reader.result);
  //     reader.readAsDataURL(file);
  //   }
  // };

  // Function to save the signature (drawn, typed, or uploaded)
  const saveSignature = () => {
    let signatureData;
    if (signatureType === "draw") {
      signatureData = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
    } else if (signatureType === "type") {
      signatureData = { text: typedSignature, font: fontFamily };
    } else if (signatureType === "upload") {
      signatureData = uploadedSignature;
    }
    console.log("Saved Signature:", signatureData); // Handle the saved signature data
  };

  const [image, setImage] = useState<any>(null); // State to store the image URL

  const handleUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file); // Create a temporary URL for the image
      setImage(imageURL); // Store the image URL in state
    }
  };
  return (
    <div>
      <h2>Digital Signature</h2>

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
          <label className="form-check-label">Draw</label>
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
          <label className="form-check-label">Type</label>
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
          <label className="form-check-label">Upload</label>
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
              onClick={clearSignature}
            >
              X
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
          <form className="form" action="#" method="post">
            <div className="fv-row">
              {/* Hidden file input */}
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

                    {/* Custom upload button */}

                    <div className="ms-4 mt-2">
                      <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                        Upload 1 file only
                      </h3>
                      <span className="fs-7 fw-semibold text-gray-500">
                        Click the button to upload a file
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            {/* Conditionally render the image below the upload button */}
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
          </form>
        )}

        {/* 
          // <input type="file" accept="image/*" onChange={handleUpload} />
        )} */}

        {uploadedSignature && signatureType === "upload" && (
          <img
            src={uploadedSignature}
            alt="Uploaded Signature"
            style={{ marginTop: "10px", maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>
    </div>
  );
};

export { DigitalSignature };
