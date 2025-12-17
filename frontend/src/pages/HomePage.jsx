import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Cards, Container, Button } from "../components/index";
import { useNavigate } from "react-router";
import api from "../utils/api";
import { setLoading, setPosts, setError, clearError } from "../store/postSlice";

const HomePage = () => {
  const { userData } = useSelector((state) => state.auth);
  const { posts, loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const fetchActivePosts = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const res = await api.get("/posts/active-post");

        dispatch(setPosts(res.data.data || []));
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        dispatch(setPosts([]));
        dispatch(
          setError(err.response?.data?.message || "Failed to fetch posts")
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchActivePosts();
  }, [userData, dispatch]);

  // Loading state
  if (userData === undefined || loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="w-full min-h-screen flex items-center justify-cente">
        No posts available. Please add Posts.
      </div>
    );
  }

  // Not logged in
  if (!userData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Container>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">
              Login to read posts
            </h1>
            <Button
              className="w-full sm:w-auto px-6 py-2 text-base sm:text-lg cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Logged in but no posts
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <h1>{error || "No posts found"}</h1>
        </Container>
      </div>
    );
  }

  // Logged in and posts available
  return (
    <div className="w-full posts-container px-8 py-14 m-2">
      <div className="flex p-2 mb-5 justify-end">
        <p className="text-gray-600 text-lg font-semibold">
          Welcome, <span className="text-indigo-600">{userData.username}</span>
        </p>
      </div>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="flex-1 min-w-[250px] max-w-sm">
              <Cards {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
