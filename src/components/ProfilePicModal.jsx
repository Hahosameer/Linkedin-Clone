import React, { useState, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CircularProgressWithLabel from "./Progress.jsx";
import { uploadImage } from "../firebase/functions.jsx";
import { updateProfilePicture, setProgress } from "../Redux/Slices/profileSlice.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  height: "100vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 3,
  overflow: "auto",
  "@media (max-width: 768px)": {
    width: "100%",
    borderRadius: 0,
  },
};

const ProfileModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const progress = useSelector((state) => state.profile.progress);

  const [sharedImage, setSharedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);

  const handleChangeImage = (e) => {
    const image = e.target.files[0];
    if (!image || !image.type.startsWith("image")) {
      alert("Please select a valid image file.");
      return;
    }
    setSharedImage(image);
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!sharedImage) return;

    try {
      setUploading(true);

      const imageName = Date.now() + sharedImage.name;
      const imageURL = await uploadImage(sharedImage, imageName, dispatch);

      // Dispatch the updateProfilePicture action to update the profile picture in Redux store
      dispatch(updateProfilePicture(imageURL));

      // Reset states
      setSharedImage(null);
      setUploading(false);
      dispatch(setProgress(0));
      handleClose();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploading(false);
    }
  };

  return (
    <Modal
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Header>
            <h2>Update Profile Picture</h2>
            <button onClick={() => handleClose(false)}>
              <CloseIcon />
            </button>
          </Header>
          <Content>
            <input
              type="file"
              accept="image/gif, image/jpeg, image/png"
              style={{ display: "none" }}
              ref={imageInputRef}
              onChange={handleChangeImage}
            />
            {sharedImage && (
              <Preview>
                <img src={URL.createObjectURL(sharedImage)} alt="Profile Preview" />
              </Preview>
            )}
            {uploading && (
              <Box sx={{ width: '100%', mt: 2, display: "flex", justifyContent: "center" }}>
                <CircularProgressWithLabel value={progress} />
              </Box>
            )}
            <Actions>
              <button onClick={() => imageInputRef.current.click()}>
                <PhotoLibraryIcon /> Select Image
              </button>
              <UploadButton onClick={uploadHandler} disabled={!sharedImage}>
                Upload
              </UploadButton>
            </Actions>
          </Content>
        </Box>
      </Fade>
    </Modal>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 10px 20px;
  button {
    cursor: pointer;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Preview = styled.div`
  margin: 26px 0;
  img {
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 16px;
  position: absolute;
  bottom: 20px;
  button {
    padding: 8px 16px;
    cursor: pointer;
  }
`;

const UploadButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background-color: ${(props) => (props.disabled ? "#ccc" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "#666" : "#fff")};
`;

export default ProfileModal;
