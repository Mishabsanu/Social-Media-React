import { useState } from "react";
import axios from "../../utils/axios";
import { editProfile } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../Redux/userSlice/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const user = useSelector((state) => state.user);
  const username = user?.user?.userName;
  const userEail = user?.user?.email;
  const userImage = user?.user?.profilePic;
  const [userName, setUserName] = useState(username);
  const [email, setEmail] = useState(userEail);
  const [error, setError] = useState("");

  const [imageSelected, setImageSelected] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl;

    if (imageSelected) {
      const formData = new FormData();
      formData.append("file", imageSelected);
      formData.append("upload_preset", "ml_default");
      reset();
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dwkom79iv/image/upload",
          formData,
          { withCredentials: false }
        );

        imageUrl = response.data.secure_url;
      } catch (error) {
        setError("Failed to upload image.");
        return;
      }
    }

    const data = {
      userName: userName,
      email: email,
      profilePic: imageUrl,
    };

    try {
      const response = await axios.post(`${editProfile}/${id}`, data);
      dispatch(setLogin({ user: response.data.update }));
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const reset = () => {
    setImageSelected(null);
  };
  const acceptedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 1000000; // 1MB
  const onImageSelect = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      acceptedFileTypes.includes(file.type) &&
      file.size <= maxFileSize
    ) {
      setImageSelected(file);
      setError("");
    } else {
      setImageSelected("");
      setError(
        `Please select an image of type ${acceptedFileTypes.join(
          ", "
        )} and size up to ${maxFileSize / 1000000} MB`
      );
    }
  };

  return (
    <>
      <Topbar />
      <div className="main-container">
        <div className="form-div">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="">NAME</label>
              <input
                type="text"
                defaultValue={userName}
                placeholder="Enter Name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">EMAIL</label>
              <input
                type="email"
                defaultValue={email}
                placeholder="Enter Emil"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image">IMAGE</label>
              <input
                type="file"
                id="image"
                onChange={onImageSelect}
                accept={acceptedFileTypes.join(",")}
              />
              {(imageSelected || userImage) && (
                <img
                  src={
                    imageSelected
                      ? URL.createObjectURL(imageSelected)
                      : userImage
                  }
                  alt="Selected"
                  style={{ width: "200px" }}
                />
              )}
            </div>
            <button type="submit">SUBMIT</button>
          </form>
          {error && <div className="error_msg">{error}</div>}
        </div>
      </div>
    </>
  );
};

export default EditProfile;
