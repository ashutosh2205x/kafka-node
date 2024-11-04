import mongoose from "mongoose";

interface Post {
  title: string;
  body: string;
}

const postSchema = new mongoose.Schema<Post>({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
export default PostModel;
