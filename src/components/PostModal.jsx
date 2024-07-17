
import React, { useState, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ReactPlayer from "react-player";
import { uploadImage, addInDB } from "../firebase/functions.jsx";
import {
  postArticleFailure,
  postArticlePending,
  postArticleSuccess,
  setProgress, 
} from "../Redux/Slices/AriticleSlice.jsx";
import CircularProgressWithLabel from "./Progress.jsx";


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

const TransitionsModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const progress = useSelector((state) => state.article.progress); 

  const [editorText, setEditorText] = useState("");
  const [sharedImage, setSharedImage] = useState(null);
  const [sharedVideo, setSharedVideo] = useState(null);
  const [assetArea, setAssetArea] = useState("");
  const [uploading, setUploading] = useState(false); 

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleChangeImage = (e) => {
    const image = e.target.files[0];
    if (!image || !image.type.startsWith("image")) {
      alert("Please select a valid image file.");
      return;
    }
    setSharedImage(image);
    setAssetArea("image");
  };

  const handleChangeVideo = (e) => {
    const video = e.target.files[0];
    if (!video || !video.type.startsWith("video")) {
      alert("Please select a valid video file.");
      return;
    }
    setSharedVideo(video);
    setAssetArea("media");
  };

  const postHandler = async (e) => {
    e.preventDefault();

    try {
      setUploading(true); 

      const currentUser = {
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        email: user.email,
      };

      let post = {
        user: currentUser,
        description: editorText,
        timestamp: Date.now(),
        likes: [],
        comments: [],
        id: Date.now(),
      };

      if (assetArea === "image" && sharedImage) {
        const imageName = Date.now() + sharedImage.name;
        post.image = await uploadImage(sharedImage, imageName, dispatch);
      } else if (assetArea === "media" && sharedVideo) {
        const videoName = Date.now() + sharedVideo.name;
        post.video = await uploadImage(sharedVideo, videoName, dispatch); 
      }

      dispatch(postArticlePending());
      await addInDB(post);
      window.location.reload();
      dispatch(postArticleSuccess(post)); 

      // Reset states
      setEditorText("");
      setSharedImage(null);
      setSharedVideo(null);
      setAssetArea("");
      setUploading(false); // Stop uploading
      dispatch(setProgress(0)); // Reset progress in Redux store
      handleClose(); // Close the modal after reset
    } catch (error) {
      console.error("Error posting:", error);
      dispatch(postArticleFailure(error.message)); // Dispatch the postArticleFailure action in case of error
      setUploading(false); // Stop uploading in case of error
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
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
              <UserInfo>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <div>
                  <h1>{user?.displayName ? user.displayName : "there"}</h1>
                  <p>Post to Anyone</p>
                </div>
                <ArrowDropDownIcon sx={{ width: 18, height: 18 }} />
              </UserInfo>
              <button onClick={() => handleClose(false)}>
                <CloseIcon />
              </button>
            </Header>
            <SharedContent>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  autoFocus={true}
                />
                {assetArea === "image" && sharedImage && (
                  <UploadImage>
                    <img src={URL.createObjectURL(sharedImage)} alt="" />
                  </UploadImage>
                )}
                {assetArea === "media" && sharedVideo && (
                  <ReactPlayer
                    width="100%"
                    url={URL.createObjectURL(sharedVideo)}
                    controls
                  />
                )}
              </Editor>
              {uploading && (
                <Box sx={{ width: '100%', mt: 2, display: "flex", justifyContent: "center" , backgroundColor: "rgba(0, 0, 0, 0.3)" , padding: "5px"}}>
                  <CircularProgressWithLabel value={progress} />
                </Box>
              )}
            </SharedContent>
            <ShareCreation>
              <AttachAssets>
                <input
                  type="file"
                  accept="image/gif, image/jpeg, image/png"
                  style={{ display: "none" }}
                  ref={imageInputRef}
                  onChange={handleChangeImage}
                />
                <input
                  type="file"
                  accept="video/mp4, video/mkv, video/webm"
                  style={{ display: "none" }}
                  ref={videoInputRef}
                  onChange={handleChangeVideo}
                />
                <AssetButton onClick={() => imageInputRef.current.click()}>
                  <PhotoLibraryIcon />
                </AssetButton>
                <AssetButton onClick={() => videoInputRef.current.click()}>
                  <VideoLibraryIcon />
                </AssetButton>
              </AttachAssets>
              <PostButton
                onClick={postHandler}
                disabled={!editorText && !sharedImage && !sharedVideo}
              >
                Post
              </PostButton>
            </ShareCreation>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

const Header = styled.div`
  display: block;
  padding: 10px 13px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 1);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    cursor: pointer;
    border: none;
    background: white;
  }
`;
const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 10px;
  &:hover {
    background-color: #f3f3f3;
    border-radius: 5px;
  }
  svg,
  img {
    width: 58px;
    height: 58px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
  }

  h1 {
    font-weight: 600;
    font-size: 19px;
    line-height: 1.5;
    margin-left: 5px;
  }
  p {
    font-weight: 400;
    font-size: 14px;
    margin-left: 5px;
  }
`;
const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;
const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  border: none;
  background: white;
  margin-right: 10px;
  /* background-color: red; */
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
    cursor: pointer;
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.08)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgba(0,0,0,0.5)" : "white")};
  border: none;
  cursor: pointer;
`;

const Editor = styled.div`
  /* padding: 12px 24px; */
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    border: none;
    outline: none;
  }
  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
  textarea::placeholder {
    font-size: 20px; /* Placeholder ka size */
    color: gray; /* Placeholder ka rang */
  }
`;

const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
    height: 100%;
  }
`;
export default TransitionsModal;
