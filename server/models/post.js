import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    likes: {
      type: Array,
      default: [],
      required: false,
    },
    comments: [
      {
        text: {
          type: String,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isDelete: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("post", postSchema);

export { Post };
