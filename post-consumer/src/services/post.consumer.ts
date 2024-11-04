import kafkaConfig from "../config/kafka.config";
import PostModel from "../models/post.model";

export const postConsumer = async () => {
  const messages: any[] = [];
  let processing = false;
  try {
    await kafkaConfig.subscribeTopic("post");
    await kafkaConfig.consume(async (msg) => {
      messages.push(msg);
      console.log("msg", msg);
      if (messages.length > 10) {
        processMessages();
      }
      setInterval(processMessages, 5000);
    });
  } catch (error) {
    console.log("post consumer error... ", error);
  }

  async function processMessages() {
    if (messages.length > 0 && !processing) {
      processing = true;
      const batchToProcess = [...messages];
      messages.length = 0;
      try {
        await PostModel.insertMany(batchToProcess, { ordered: false });
        console.log("bulk inseriton completed...");
      } catch (error) {
        console.log("bulk inseriton error... ", error);
        messages.push(...batchToProcess);
      } finally {
        processing = false;
      }
    }
  }
};
