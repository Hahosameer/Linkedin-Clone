import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { updateProfileData } from "../Redux/Slices/profileSlice";

const EditProfileModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile.userProfile);
  const { user } = useSelector((state) => state.user);
  const [editedProfile, setEditedProfile] = useState({
    city: userProfile.city || "",
    country: userProfile.country || "",
    headline: userProfile.headline || "",
    firstname: userProfile.firstname || "",
    lastname: userProfile.lastname || "",
  });
  useEffect(() => {
    setEditedProfile({
      city: userProfile.city || user?.city || "",
      country: userProfile.country || user?.country || "",
      headline: userProfile.headline || user?.headline || "",
      firstname: userProfile.firstname || user?.firstname || "",
      lastname: userProfile.lastname || user?.lastname || "",
    });
  }, [userProfile, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    dispatch(updateProfileData(editedProfile));
    handleClose();
  };

  console.log(editedProfile, "editedProfile");
  console.log(userProfile, "userProfile");

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="firstname"
          name="firstname"
          label="First Name"
          fullWidth
          value={editedProfile.firstname}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="lastname"
          name="lastname"
          label="Last Name"
          fullWidth
          value={editedProfile.lastname}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="country"
          name="country"
          label="Country/Region"
          fullWidth
          value={editedProfile.country}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="city"
          name="city"
          label="City"
          fullWidth
          value={editedProfile.city}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          id="headline"
          name="headline"
          label="Headline"
          fullWidth
          value={editedProfile.headline}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveChanges}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
