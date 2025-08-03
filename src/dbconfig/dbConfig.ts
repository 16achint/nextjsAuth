import mongoose from "mongoose";

export async function Connect() {
  try {
    console.log("Mongo URI:", process.env.MONGO_URL);

    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("mongoDB connected");
    });
    connection.on("error", (err) => {
      console.log("some went wrong", err);
    });
  } catch (error) {
    console.log("something is wrong :", error);
  }
}
