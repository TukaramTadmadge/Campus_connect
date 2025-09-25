import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import axios from "axios";
import { toast } from "react-toastify";
import "./ProfileDetail.css";

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth);

  const [profilePic, setProfilePic] = useState(null);
  const [noteFile, setNoteFile] = useState(null);
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [currentProfile, setCurrentProfile] = useState(user.profilePicture || user.image);

  if (!user) return null;

  // Update profile picture without logout
  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePic) return toast.error("Please choose a profile picture first!");
    const formData = new FormData();
    formData.append("profilePicture", profilePic);
    try {
      const res = await axios.post(
        `http://localhost:9000/api/profile-picture/${user._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Profile picture updated successfully!");
      // Update locally without reload
      setCurrentProfile(res.data.profilePicture || URL.createObjectURL(profilePic));
      setProfilePic(null);
    } catch (err) {
      console.error(err);
      toast.error("Profile picture upload failed!");
    }
  };

  // Upload notes without logging out
  const handleNotesUpload = async (e) => {
    e.preventDefault();
    if (!noteFile || !yearOfStudy || !department || !subject)
      return toast.error("Please fill in all fields before uploading notes!");

    const formData = new FormData();
    formData.append("noteFile", noteFile);
    formData.append("yearOfStudy", yearOfStudy);
    formData.append("department", department);
    formData.append("subject", subject);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:9000/api/notes/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Notes uploaded successfully!");
        // Reset form fields
        setYearOfStudy("");
        setDepartment("");
        setSubject("");
        setNoteFile(null);
      } else {
        toast.error(res.data.message || "Notes upload failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Notes upload failed!");
    }
  };

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <h2 className="profile-title">Your Profile</h2>

        <div className="profile-content">
          {/* Profile Info */}
          <div className="profile-info">
            <h3>Name: <span>{user.firstName} {user.lastName}</span></h3>
            <h3>Email: <span>{user.email}</span></h3>
            {user.department && <h3>Department: <span>{user.department}</span></h3>}
            {user.isSenior !== undefined && <h3>Role: <span>{user.isSenior ? "Senior" : "Junior"}</span></h3>}
            <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}>
              Logout
            </button>
          </div>

          {/* Profile Picture Upload */}
          <div className="profile-upload">
            <img
              src={currentProfile ? `/uploads/${currentProfile}` : "/images/dyp.png"}
              alt="profile"
              className="profile-img"
            />
            <form onSubmit={handleProfilePicUpload} className="upload-form">
              <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
              <button type="submit">Update Picture</button>
            </form>
          </div>
        </div>

        {/* Notes Upload */}
        <div className="notes-upload">
          <h3>Upload Notes</h3>
          <form onSubmit={handleNotesUpload}>
            <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}>
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="">Select Department</option>
              <option value="CSE">Computer Science and Engineering</option>
              <option value="MECH">Mechanical Engineering</option>
              <option value="CHE">Chemical Engineering</option>
              <option value="CIVIL">Civil Engineering</option>
              <option value="ARCH">Architecture</option>
              <option value="DS">Data Science and Engineering</option>
              <option value="AIML">Artificial Intelligence and Machine Learning</option>
              <option value="EEE">Electrical and Electronics Engineering</option>

            </select>
            <input type="text" placeholder="Enter Subject Name" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setNoteFile(e.target.files[0])} />
            <button type="submit">Upload Notes</button>
          </form>
        </div>

        {/* Close Button */}
        <div className="close-btn" onClick={() => dispatch(setProfileDetail())}>
          <MdOutlineClose />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
