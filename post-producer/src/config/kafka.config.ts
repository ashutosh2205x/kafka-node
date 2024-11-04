import { Kafka, Admin, Producer, logLevel, Partitioners } from "kafkajs";
import ip from "ip";

class KafkaConfig {
  private kafka: Kafka;
  private admin: Admin;
  private brokers: string;
  constructor() {
    this.brokers = `${ip.address()!}:9092`;
    // this.brokers = "192.168.1.3:9092";
    console.log("brokers", ip.address());
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.brokers, "kafka:9092"],
      logLevel: logLevel.ERROR,
    });
    this.admin = this.kafka.admin();
  }

  async connect() {
    try {
      await this.kafka.admin().connect();
      console.log("kafka connected... ");
    } catch (error) {
      console.log("kafa connected error... ", error);
    }
  }

  async createTopic(topic: string) {
    try {
      await this.admin.createTopics({ waitForLeaders: true, timeout: 5000, topics: [{ topic, numPartitions: 1 }] });
      console.log("topic created... ");
    } catch (error) {
      console.log("TOPIC CREATION ERROR ... ", error);
    }
  }

  async sentToTopic(topic: string, message: string) {
    try {
      this.kafka.producer().send({ topic, messages: [{ value: message }] });
    } catch (error) {
      console.log("topic sent error... ");
    }
  }

  async disconnect() {
    try {
      this.kafka.admin().disconnect();
    } catch (error) {
      console.log("kafka disconnect error... ");
    }
  }
}

export default new KafkaConfig();
