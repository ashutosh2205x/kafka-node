import mongoose from "mongoose";

export const dbConfig = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/eda-test")
    .then(() => console.log("connected to db..."))
    .catch((err) => {
      console.log("error while connecting to db... ", err);
    });
};
