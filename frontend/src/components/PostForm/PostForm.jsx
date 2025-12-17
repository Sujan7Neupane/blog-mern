import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button, Container, Input } from "../index";
import {
  setLoading,
  setError,
  addPost,
  updatePostInState,
} from "../../store/postSlice";
import api from "../../utils/api";

const PostForm = ({ post }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "Active",
    },
  });

  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");
  const { options, loading } = useSelector((state) => state.post);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitForm = async (data) => {
    setLocalError("");
    setSuccess("");
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("status", data.status);

    if (data.image?.[0]) {
      formData.append("featuredImage", data.image[0]);
    }

    try {
      let result;

      if (post) {
        const res = await api.put(`/posts/update/${post._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        result = res.data.data;
        dispatch(updatePostInState(result));
        setSuccess("Post updated successfully!");
      } else {
        const res = await api.post("/posts/create-post", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        result = res.data.data;
        dispatch(addPost(result));
        setSuccess("Post created successfully!");
      }

      setTimeout(() => navigate(`/post/${result._id}`), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setLocalError(message);
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Container>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
          {post ? "Update Post" : "Create a Post"}
        </h2>

        <form
          className="space-y-4"
          encType="multipart/form-data"
          onSubmit={handleSubmit(submitForm)}
        >
          <Input
            label="Title"
            type="text"
            placeholder="Enter Title"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: { value: 50, message: "Max 50 characters" },
            })}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <textarea
            placeholder="Write your content here..."
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("content", {
              required: "Content is required",
              minLength: { value: 10, message: "At least 10 characters" },
              maxLength: { value: 1000, message: "Max 1000 characters" },
            })}
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}

          <Input
            type="file"
            accept="image/*"
            {...register("image", {
              required: !post ? "Featured image is required" : false,
              validate: {
                checkFileType: (fileList) =>
                  !fileList[0] ||
                  ["image/jpeg", "image/png", "image/gif"].includes(
                    fileList[0].type
                  ) ||
                  "Only JPEG, PNG, GIF allowed",
                checkFileSize: (fileList) =>
                  !fileList[0] ||
                  fileList[0].size <= 5 * 1024 * 1024 ||
                  "Max 5MB",
              },
            })}
          />
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}

          {post?.featuredImage && (
            <div className="w-full mb-4">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="rounded-lg"
              />
            </div>
          )}

          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("status", { required: "Status is required" })}
          >
            <option value="">Select Status</option>
            {options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}

          {localError && (
            <div className="mt-4 bg-red-100 text-red-700 text-sm px-4 py-2 rounded">
              {localError}
            </div>
          )}
          {success && (
            <div className="mt-4 bg-green-100 text-green-700 text-sm px-4 py-2 rounded">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            bgColor={post ? "bg-green-500" : "bg-blue-500"}
            disabled={loading}
          >
            {loading ? "Loading..." : post ? "Update Post" : "Submit Post"}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default PostForm;
