import { useState } from "react";
import axios from "../../utils/axios";
import { editPost } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import {setPosts } from "../../Redux/userSlice/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../topbar/Topbar";
const EditPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const post = useSelector((state) => state.posts);
  const userImage=post?.image
  const userContent=post?.content
  const [content, setContent] = useState(userContent);
  const [imageSelected, setImageSelected] = useState(null);
  const [error, setError] = useState("");

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
        console.log(error);
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setError(error.response.data.error);
        }
      }
    }

    const data = {
      content: content,
      image: imageUrl,
    };

    try {
      const response = await axios.post(`${editPost}/${id}`, data);
      console.log(response);
      dispatch(setPosts({ posts: response.data.update}));
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.error);
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
    <Topbar/>
    <div className="main-container">
      <div className="form-div">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="">Content</label>
            <input
              type="text"
              defaultValue={post?.content}
              placeholder="Enter Content"
              onChange={(e) => setContent(e.target.value)}
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
    

  

          <button type="submit">submit</button>
        </form>
        {error && <div className="error_msg">{error}</div>}
      </div>
    </div>
    </>
  );
};

export default EditPost;
