import KafkaConfig from "./kafka.config";

export async function init() {
  try {
    await KafkaConfig.connect();
    await KafkaConfig.createTopic("posts");
  } catch (error) {
    console.log("ERROR INIT ...", error);
    process.exit(1);
  }
}
