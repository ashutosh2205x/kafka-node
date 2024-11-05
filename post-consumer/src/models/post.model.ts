import mongoose from "mongoose";

export interface Post {
  title: string;
  body: string;
  pid: string;
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
  pid: {
    type: String,
  },
});

const PostModel = mongoose.models.Post || mongoose.model("Post", postSchema);
export default PostModel;
