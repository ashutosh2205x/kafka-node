import { dbConfig } from "../config/db.config";
import kafkaConfig from "../config/kafka.config";
import { postConsumer } from "./post.consumer";

export const init = async () => {
  try {
    await dbConfig();
    await kafkaConfig.connect();
    await postConsumer()
  } catch (error) {
    console.log("ERROR INIT ...", error);
    process.exit(1);
  }
};
