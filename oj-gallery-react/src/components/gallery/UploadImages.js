import { useRef, useContext, useState } from "react";
import { Fab } from "@mui/material";
import { Box } from "@mui/system";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AuthContext from "../../store/auth-context.js";
import api from "./../../configurations/api.json";
import Loader from "../common/Loader";
import Toast from "../common/Toast.js";

require("dotenv").config();

/**
 * Component function for uploading the image
 * Once the image is uploaded it is appened on the homepage
 * @param props
 * @returns
 */
const UploadImages = ({ imageData, setImageData }) => {
  const authContext = useContext(AuthContext);
  const fileInput = useRef(null);
  const [loader, showLoader] = useState(false);
  let [toast, showToast] = useState(false);
  let [toastMessage, setToastMessage] = useState("");
  let [toastSeverity, setToastSeverity] = useState("info");

  /**
   * Handler for closing Toast
   * @param event
   * @param reason
   * @returns
   */
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    showToast(false);
  };

  /**
   * Function to click on hiddle file input when upload
   * fab is clicked
   */
  const handleFileUploadClick = () => {
    fileInput.current.click();
  };

  /**
   * Function to upload image to the server and append the
   * image to the images shown on homepage
   * @param event
   */
  const uploadImage = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.GALLERY.UPLOAD_PICTURE}`;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authContext.token}`,
        },
        body: formData,
      };
      showLoader(true);
      fetch(apiUrl, requestOptions)
        .then((res) => {
          if (res.status === 422) {
            throw new Error(res.message);
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          setImageData([data.picture, ...imageData]);
          setToastMessage("Picture uploaded successfully");
          setToastSeverity("success");
          showToast(true);
          showLoader(false);
        })
        .catch((error) => {
          showLoader(false);
          setToastMessage(error.message);
          setToastSeverity("error");
          showToast(true);
          console.log(error);
        });
    }
  };

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab
        onClick={handleFileUploadClick}
        variant="extended"
        style={{
          backgroundColor: "#282C35",
          color: "#f2f2f2",
          position: "fixed",
          bottom: "3vh",
          right: "3vw",
        }}
      >
        <FileUploadIcon sx={{ mr: 1 }} />
        Upload
      </Fab>
      <input
        ref={fileInput}
        onChange={(e) => uploadImage(e)}
        type="file"
        name="image"
        id="image"
        accept="image/*"
        style={{ display: "none" }}
      />
      {loader && <Loader />}
      {toast && (
        <Toast
          message={toastMessage}
          severity={toastSeverity}
          handleToastClose={handleToastClose}
        />
      )}
    </Box>
  );
};

export default UploadImages;
