import { useState } from "react";
import axios from "../../utils/axios";
import { PostsAdd } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../Redux/userSlice/userSlice";
import { useNavigate } from "react-router-dom";

const PostAdd = () => {
  const user = useSelector((state) => state.user);
  const id = user.user?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
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
        setError("Failed to upload image.");
        return;
      }
    }

    const data = {
      content: content,
      image: imageUrl,
    };

    try {
      const response = await axios.post(`${PostsAdd}/${id}`, data);
      dispatch(setPosts({ posts: response.data.populatedPost }));
      navigate("/");
    } catch (error) {
      setError("Failed to create post.");
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
    <div className="main-container">
      <div className="form-div">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="content">CONTENT</label>
            <input
              type="text"
              id="content"
              placeholder="Enter CONTENT"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="image">IMAGE</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={onImageSelect}
            />
            {imageSelected && (
              <img
                src={URL.createObjectURL(imageSelected)}
                alt="Selected"
                style={{ width: "200px" }}
              />
            )}
          </div>
          <button type="submit">Submit</button>
        </form>
        {error && <div className="error_msg">{error}</div>}
      </div>

    </div>
  );
};

export default PostAdd;
