import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Container, PostForm } from "../components/index";
import api from "../utils/api";
import {
  setPost,
  setLoading,
  setError,
  clearError,
  updatePostInState,
} from "../store/postSlice";

const EditPosts = () => {
  const { post, loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Post ID from route
  const [localLoading, setLocalLoading] = useState(true); // Local fetch loading

  // Fetch post from backend
  useEffect(() => {
    const fetchPost = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const res = await api.get(`/posts/p/${id}`);
        dispatch(setPost(res.data.data));
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Failed to fetch post";

        dispatch(setError(msg));
        console.error("FETCH POST ERROR:", err);
        navigate("/");
      } finally {
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    };

    fetchPost();
  }, [id, dispatch, navigate]);

  // Handle post update
  const handleUpdate = async (formData) => {
    try {
      const res = await api.put(`/posts/update/${post._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(updatePostInState(res.data.data));
      navigate(`/post/${id}`);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Post update failed";

      dispatch(setError(msg));
      console.error("UPDATE POST ERROR:", err);
    }
  };

  if (loading || localLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Container>
      {post && <PostForm post={post} onSubmit={handleUpdate} />}
    </Container>
  );
};

export default EditPosts;
