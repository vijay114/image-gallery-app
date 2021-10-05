import * as React from "react";
import { useEffect, useContext, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useWindowDimensions from "./../util/Utils.js";
import UploadImages from "./UploadImages.js";
import AuthContext from "../../store/auth-context.js";
import api from "./../../configurations/api.json";
import { IconButton, ImageListItemBar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmationDialog from "../common/ConfirmationDialog.js";
import Loader from "../common/Loader";
import Toast from "../common/Toast.js";

require("dotenv").config();

/**
 * Component function for listing images
 * It fetches images using API and display the thumbnail
 * in the homepage
 * @returns
 */
function ListImages() {
  const authContext = useContext(AuthContext);
  let [imageData, setImageData] = useState([]);
  let [pictureToDelete, setPictureToDelete] = useState();
  let [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
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
   * Defining number of photos coloumn based on window width
   */
  const { width } = useWindowDimensions();

  let photoCols = 5;

  if (width <= 600) {
    photoCols = 3;
  } else if (width <= 768) {
    photoCols = 4;
  } else if (width <= 1400) {
    photoCols = 5;
  } else {
    photoCols = 6;
  }

  /**
   * loading images on the page load
   */
  useEffect(() => {
    if (imageData.length === 0) {
      showLoader(true);
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.GALLERY.LIST_PICTURES}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`,
        },
      };
      fetch(apiUrl, requestOptions)
        .then((res) => {
          showLoader(false);
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          setImageData(data.pictures);
        })
        .catch((error) => {
          showLoader(false);
          console.log(error);
          setToastMessage(error.message);
          setToastSeverity("error");
          showToast(true);
        });
    }
  }, [imageData.length, authContext.token]);

  /**
   * Function to display confirmation dialog box
   * @param pictureId
   */
  const confirmDeletePicture = (pictureId) => {
    setPictureToDelete(pictureId);
    setDisplayConfirmDialog(true);
  };

  /**
   * Function to delete image using API
   * Once image is delete, it is also removed from
   * the images shown on home page
   */
  const deletePicture = () => {
    const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.GALLERY.DELETE_PICTURE}${pictureToDelete}`;
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authContext.token}`,
      },
    };
    showLoader(true);
    fetch(apiUrl, requestOptions)
      .then((res) => {
        showLoader(false);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(
            "An error occurred while processing your request. Please try again"
          );
        }
        return res.json();
      })
      .then((data) => {
        setImageData(
          imageData.filter((image) => {
            return image._id !== pictureToDelete;
          })
        );
        setToastMessage("Picture deleted successfully");
        setToastSeverity("error");
        showToast(true);
        setPictureToDelete(null);
      })
      .catch((error) => {
        showLoader(false);
        console.log(error);
        setPictureToDelete(null);
        setToastMessage(error.message);
        setToastSeverity("error");
        showToast(true);
      });
    setDisplayConfirmDialog(false);
  };

  /**
   * Function handler for handling the delete picture
   * cancel click
   */
  const cancelDeletePicture = () => {
    setDisplayConfirmDialog(false);
  };

  /**
   * Function handler for handling lightbox
   * @param isOpen
   * @param photoIndex
   */
  const lightBoxHandler = (isOpen, photoIndex) => {
    setIsOpen(isOpen);
    setPhotoIndex(photoIndex);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "80vh" }} style={{ marginTop: "68px" }}>
      <ImageList variant="masonry" cols={photoCols} gap={12}>
        {imageData.map((item, index) => (
          <ImageListItem key={item._id}>
            <img
              src={`${process.env.REACT_APP_API_SERVER_URL}${item.thumbnailImageUrl}`}
              srcSet={`${process.env.REACT_APP_API_SERVER_URL}${item.thumbnailImageUrl}`}
              alt={item._id}
              loading="lazy"
              onClick={() => {
                lightBoxHandler(true, index);
              }}
            />
            <ImageListItemBar
              sx={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, " +
                  "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
              }}
              position="bottom"
              actionIcon={
                <IconButton
                  sx={{ color: "white" }}
                  aria-label={`star ${item.title}`}
                  onClick={() => confirmDeletePicture(item._id)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              }
              actionPosition="right"
            />
          </ImageListItem>
        ))}
      </ImageList>
      <UploadImages imageData={imageData} setImageData={setImageData} />

      {isOpen && (
        <Lightbox
          mainSrc={`${process.env.REACT_APP_API_SERVER_URL}${imageData[photoIndex].imageUrl}`}
          nextSrc={`${process.env.REACT_APP_API_SERVER_URL}${
            imageData[(photoIndex + 1) % imageData.length].imageUrl
          }`}
          prevSrc={`${process.env.REACT_APP_API_SERVER_URL}${
            imageData[(photoIndex + imageData.length - 1) % imageData.length]
              .imageUrl
          }`}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex + imageData.length - 1) % imageData.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % imageData.length)
          }
        />
      )}
      {displayConfirmDialog && (
        <ConfirmationDialog
          agreeText="Yes"
          notAgreeText="No"
          title="Delete?"
          message="Are you sure you want to delete this picture?"
          handleDisagree={cancelDeletePicture}
          handleAgree={deletePicture}
        />
      )}
      {toast && (
        <Toast
          message={toastMessage}
          severity={toastSeverity}
          handleToastClose={handleToastClose}
        />
      )}
      {loader && <Loader />}
    </Box>
  );
}

export default ListImages;
