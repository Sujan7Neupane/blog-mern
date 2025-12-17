import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandlerWrapper.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import { Post } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
  //get details from front-end
  const { title, content, status } = req.body;

  const fields = { title, content, status };

  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      throw new ApiError(400, `${key} cannot be empty!`);
    }
  }
  const existingPost = await Post.findOne({ title: title.trim() });
  if (existingPost) {
    throw new ApiError(400, "Post already exists!");
  }

  const featuredImageLocalPath = req.file?.path;

  if (!featuredImageLocalPath) {
    throw new ApiError(400, "featuredImageLocalPath is missing!");
  }

  const featuredImage = await uploadOnCloudinary(featuredImageLocalPath);
  if (!featuredImage) {
    throw new ApiError(400, "Featured Image is required!");
  }

  const post = await Post.create({
    title: title.trim(),
    content,
    status,
    featuredImage: featuredImage.url
      ? featuredImage.url.replace("http://", "https://")
      : "",
    postedBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post Created successfully!"));
});

// Normally postedBy:'654981651984651989' yesari ID aauxa

// const getAllPost = asyncHandler(async (_req, res) => {
//   const activePosts = await Post.find({ status: "Active" });

//   if (activePosts.length === 0) {
//     throw new ApiError(404, "No posts available!");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, activePosts, "Posts fetched successfully!"));
// });

// Yesari lyauna postedBy: "Sujan"
// Yaha username lyauna lai

const getAllActivePost = asyncHandler(async (_req, res) => {
  const activePosts = await Post.find({ status: "Active" })
    .populate("postedBy", "username")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        activePosts,
        activePosts.length
          ? "Posts fetched successfully!"
          : "No posts available!"
      )
    );
});

const getAllPost = asyncHandler(async (_req, res) => {
  const allPosts = await Post.find();

  if (!allPosts.length) {
    throw new ApiError(404, "No posts available!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "Posts fetched successfully!"));
});

const getIndividualPost = asyncHandler(async (req, res) => {
  const id = req.params.id?.trim();

  if (!id) {
    throw new ApiError(400, "post id is missing");
  }

  const post = await Post.findById(id).populate("postedBy", "username");

  if (!post) {
    throw new ApiError(404, "Post not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully!"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  const fields = { title, content, status };

  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      throw new ApiError(400, `${key} cannot be empty!`);
    }
  }

  const postId = req.params.id?.trim();

  if (!postId) {
    throw new ApiError(400, "postId id missing!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found!");
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this post!");
  }

  if (title) post.title = title.trim();
  if (content) post.content = content;
  if (status) post.status = status;

  if (req.file) {
    // Delete old image from Cloudinary
    if (post.featuredImage?.public_id) {
      await cloudinary.uploader.destroy(post.featuredImage.public_id);
    }

    // Upload new image
    const featuredImage = await uploadOnCloudinary(req.file.path);
    post.featuredImage = featuredImage.secure_url;
  }

  await post.save();

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated Successfully!"));
});

const deletePost = asyncHandler(async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) throw new ApiError(400, "Post ID is required");

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete post!");
  }

  await Post.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export {
  createPost,
  getAllActivePost,
  getAllPost,
  getIndividualPost,
  updatePost,
  deletePost,
};
