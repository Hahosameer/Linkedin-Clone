import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import ProfilePicModal from "./ProfilePicModal";
import CoverPictureModal from "./CoverPictureModal";
import EditProfileModal from "../components/EditProfileModal";
import {
  setProfilePicture,
  setCoverPicture,
  setCurrentUserProfile,
  fetchViewedUserProfile,
} from "../Redux/Slices/profileSlice";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { currentUserProfile, viewedUserProfile } = useSelector((state) => state.profile);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const { id } = useParams();

  const isCurrentUserProfile = id === user?.uid;

  useEffect(() => {
    if (isCurrentUserProfile) {
      fetchCurrentUserProfile();
    } else {
      dispatch(fetchViewedUserProfile(id));
    }
  }, [id, user?.uid, dispatch]);

  const fetchCurrentUserProfile = async () => {
    try {
      const db = getFirestore();
      const userId = user.uid;
      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        dispatch(setCurrentUserProfile({
          ...userData,
          photoURL: userData.photoURL,
          coverPhotoURL: userData.coverPhotoURL,
        }));
        dispatch(setProfilePicture(userData.photoURL || ""));
        dispatch(setCoverPicture(userData.coverPhotoURL || ""));
      }
    } catch (error) {
      console.error("Error fetching current user profile data: ", error);
    }
  };

  const handleOpenProfileModal = () => setProfileModalOpen(true);
  const handleCloseProfileModal = () => setProfileModalOpen(false);
  const handleOpenCoverModal = () => setCoverModalOpen(true);
  const handleCloseCoverModal = () => setCoverModalOpen(false);
  const handleOpenEditProfileModal = () => setEditProfileModalOpen(true);
  const handleCloseEditProfileModal = () => setEditProfileModalOpen(false);

  const profileData = isCurrentUserProfile ? currentUserProfile : viewedUserProfile;
  const profilePic = profileData?.photoURL || "/images/user.webp";
  const coverPic = profileData?.coverPhotoURL || "/images/card-bg.svg";
  const profileUrl = `www.linkedin.com/in/${profileData?.firstname?.toLowerCase()}-${profileData?.lastname?.toLowerCase()}-${id}`;

  return (
    <Container>
      <ProfileWrapper>
        <LeftSide>
          <CoverPhoto>
            {isCurrentUserProfile && (
              <Edit onClick={handleOpenCoverModal}>
                <EditIcon />
              </Edit>
            )}
            <CoverPic>
              <img src={coverPic} alt="Cover Background" />
            </CoverPic>
            <ProfilePic onClick={isCurrentUserProfile ? handleOpenProfileModal : undefined}>
              <img src={profilePic} alt="Profile" />
            </ProfilePic>
          </CoverPhoto>

          <UserData>
            {isCurrentUserProfile && (
              <EiditData onClick={handleOpenEditProfileModal}>
                <EditIcon />
              </EiditData>
            )}
            <Data>
              <h1>
                {profileData?.firstname || profileData?.lastname
                  ? `${profileData?.firstname || ""} ${profileData?.lastname || ""}`
                  : user?.displayName || ""}
              </h1>

              <ul>
                <li>{profileData.headline}</li>
              </ul>

              <p>
                {profileData.city}, {profileData.country}:{" "}
                <span>Contact info</span>
                <h3>91 connections</h3>
              </p>

              <ShowDetail>
                <EditIconDetail>
                  <EditIcon />
                </EditIconDetail>
                <h6>Open to work</h6>
                <h6>Back End Developer roles</h6>
                <a href="">Show Detail</a>
              </ShowDetail>
            </Data>
          </UserData>
        </LeftSide>
        <RightSide>
          <RightTop>
            <Top>
              <div>
                <h2>Profile language</h2>
                <p>English</p>
              </div>
              {isCurrentUserProfile && <EditIcon style={{ cursor: "pointer" }} />}
            </Top>
            <Bottom>
              <div>
                <h2>Public profile & URL</h2>
                <p>{profileUrl}</p>
              </div>
              {isCurrentUserProfile && <EditIcon style={{ cursor: "pointer" }} />}
            </Bottom>
          </RightTop>
          <RightBottom>
            <p>{profileData.firstname}, unlock your full potential with LinkedIn premium</p>
            <div>
              <img
                style={{ borderRadius: "50%", objectFit: "cover" }}
                src={profilePic}
                alt="Profile"
              />
              <img src="/images/key.jpg" alt="Key" />
            </div>
            <h5>See who's viewed your profile in the last 90 days</h5>
            <button>Try for Free</button>
          </RightBottom>
        </RightSide>
      </ProfileWrapper>
      <ProfilePicModal
        open={profileModalOpen}
        handleClose={handleCloseProfileModal}
      />
      <CoverPictureModal
        open={coverModalOpen}
        handleClose={handleCloseCoverModal}
      />
      <EditProfileModal
        open={editProfileModalOpen}
        handleClose={handleCloseEditProfileModal}
      />
    </Container>
  );
}






const Container = styled.div`
  padding-top: 75px;
  padding-left: 65px;
  padding-right: 65px;
  padding-bottom: 0px;
  max-width: 100%;
  @media (max-width: 1093px) {
    padding-left: 35px;
    padding-right: 35px;
  }
  @media (max-width: 1069px) {
    padding-left: 25px;
    padding-right: 25px;
  }
  @media (max-width: 706px) {
    padding-left: 0px;
    padding-right: 0px;
  }
`;
const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 878px) {
    display: flex;
    justify-content: space-between;
  }
  @media (max-width: 706px) {
    display: flex;
    flex-direction: column;
  }
`;
const LeftSide = styled.div`
  background-color: white;
  width: 70%;
  border-radius: 10px;
  border: 1px solid #e1dfdf;

  @media (max-width: 1093px) {
    width: 60%;
  }
  @media (max-width: 706px) {
    width: 100%;
    border-radius: 10px 10px 0px 0px;
  }
`;
// const EditData = styled.div``;
const CoverPhoto = styled.div`
  position: relative;
  width: 100%;
`;
const Edit = styled.div`
  position: absolute;
  right: 15px;
  top: 15px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const CoverPic = styled.div`
  width: 100%;
  img {
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-radius: 10px 10px 0px 0px;
    @media (max-width: 1100px) {
      height: 150px;
    }
    @media (max-width: 940px) {
      height: 120px;
    }
    @media (max-width: 706px) {
      height: 180px;
    }
    @media (max-width: 640px) {
      height: 150px;
    }
    @media (max-width: 580px) {
      height: 120px;
    }
    @media (max-width: 450px) {
      height: 100px;
    }
  }
`;
const ProfilePic = styled.div`
  img {
    position: absolute;
    top: 90px;
    left: 23px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 2px solid white;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
    @media (max-width: 1100px) {
      top: 60px;
    }
    @media (max-width: 940px) {
      top: 40px;
    }
    @media (max-width: 900px) {
      top: 20px;
    }
    @media (max-width: 706px) {
      top: 80px;
    }
    @media (max-width: 640px) {
      top: 60px;
    }
    @media (max-width: 580px) {
      top: 40px;
    }
    @media (max-width: 450px) {
      top: 20px;
    }
    @media (max-width: 380px) {
      width: 125px;
      height: 125px;
      top: 15px;
    }
    @media (max-width: 344px) {
      width: 115px;
      height: 115px;
      top: 15px;
    }
  }
`;

const UserData = styled.div`
  position: relative;
`;
const EiditData = styled.div`
  position: absolute;
  right: 15px;
  top: 10px;

  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  &:hover {
    background-color: #f3f3f3;
    transition: 0.5s;
    cursor: pointer;
  }
`;
const Data = styled.div`
  padding: 50px 20px;
  text-transform: capitalize;
  h1 {
    padding: 10px 0px;
    font-size: 25px;
    font-weight: 600;
    text-transform: capitalize;
  }
  ul {
    li {
      list-style: none;
      color: #585858;
      font-size: 16px;
    }
  }
  p {
    padding: 10px 0px;
    color: #bcbbbb;
    span {
      color: #4595d3;
      cursor: pointer;
    }
    h3 {
      padding: 10px 0px;
      color: #4595d3;
    }
  }
`;

// right bar
const RightSide = styled.div`
  width: 30%;
  margin-left: 25px;
  @media (max-width: 878px) {
    width: 40%;
  }
  @media (max-width: 706px) {
    width: 100%;
    margin: 10px 0px;
  }
`;

const RightTop = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  @media (max-width: 706px) {
    border-radius: 0px;
  }
`;
const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  font-size: 20px;
  border-bottom: 1px solid #ded8d8;
  p {
    font-size: 14px;
    padding-top: 10px;
    color: #929292;
  }
`;
const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  font-size: 20px;

  p {
    font-size: 14px;
    padding-top: 10px;
    color: #929292;
  }
`;

const RightBottom = styled.div`
  background-color: white;
  margin-top: 22px;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  p {
    font-size: 14px;
    font-weight: 200;
    color: #9c9a9a;
  }
  h5 {
    color: #9c9a9a;
    padding: 10px;
    font-size: 15px;
  }
  div {
    display: flex;
    justify-content: center;
    padding: 10px;
    img {
      width: 100px;
      height: 100px;
    }
  }
  button {
    border-radius: 20px;
    padding: 10px;
    font-size: 15px;
    color: #0a66c2;
    border: none;
    border: 1px solid #0a66c2;
  }
  @media (max-width: 706px) {
    border-radius: 0px;
  }
`;

const ShowDetail = styled.div`
  position: relative;
  width: 350px;
  background-color: #dde7f1;
  padding: 10px;
  border-radius: 10px;
  /* margin-top: 20px; */
  h6 {
    color: black;
    font-weight: 200;
  }
  a {
    color: #006aff;
    font-weight: 500;
  }
  @media (max-width: 706px) {
    width: 250px;
  }
`;
const EditIconDetail = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
  border-radius: 50%;
  padding: 7px;
  &:hover {
    background-color: #d4dde6;
  }
`;
export default Profile;
