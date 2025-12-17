import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import Container from "../components/Container";
import Button from "../components/Button";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import api from "../utils/api";

const IndividualPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userData } = useSelector((state) => state.auth);

  // Check if user is the author
  const isAuthor =
    post?.postedBy?._id && userData
      ? post.postedBy._id === userData._id
      : false;

  // console.log("INDIVIDUAL POST post:", post);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/posts/p/${id}`);
        setPost(res.data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const deletePost = async () => {
    try {
      await api.delete(`/posts/delete/${post._id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <p className="text-center text-gray-500">Loading post...</p>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <p className="text-center text-gray-500">Post not found.</p>
      </Container>
    );
  }

  return (
    <div className="py-12">
      <div className="flex flex-col justify-center items-center gap-8">
        {/* Image Section */}
        <div className="relative w-[650px] max-w-2xl border rounded-xl overflow-hidden shadow-sm sm:h-[300px]">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-xl">
              No image available
            </div>
          )}

          {/* Author Controls */}
          {isAuthor && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Link to={`/update/${post._id}`}>
                <Button
                  bgColor="bg-green-600 hover:bg-green-700"
                  className="text-white cursor-pointer"
                >
                  Edit
                </Button>
              </Link>

              <Button
                bgColor="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this post?")) {
                    deletePost();
                  }
                }}
                className="text-white cursor-pointer"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title and Meta */}
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {post.title}
          </h1>

          {/* Content */}
          <div className="max-w-2xl w-full browser-css text-center">
            {parse(String(post.content))}
          </div>

          {/* Author Info */}
          <div className="max-w-2xl w-full browser-css text-center text-gray-400 mt-3">
            <p>
              Published by <span>{post.postedBy?.username || "Unknown"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPost;
