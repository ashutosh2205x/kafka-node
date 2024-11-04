import { Kafka, Admin, Producer, logLevel, Partitioners } from "kafkajs";
import ip from "ip";

class KafkaConfig {
  private kafka: Kafka;
  private admin: Admin;
  private brokers: string;
  private producer: Producer;
  constructor() {
    this.brokers = `${ip.address()!}:9092`;
    // this.brokers = "192.168.1.3:9092";
    console.log("brokers", ip.address());
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.brokers, "localhost:9092", "localhost:8081"],
      logLevel: logLevel.ERROR,
      connectionTimeout: 3000,
      retry: {
        initialRetryTime: 100,
        retries: 10,
      },
    });
    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer({
      retry: {
        initialRetryTime: 10,
      },
    });
  }

  async connect() {
    try {
      await this.kafka.admin().connect();
      await this.producer.connect();
      console.log("kafka connected... ");
    } catch (error) {
      console.log("kafa connected error... ", error);
    }
  }

  async createTopic(topic: string) {
    try {
      const existingTopics = await this.admin.listTopics();
      if (existingTopics.length == 0 || !existingTopics.includes(topic)) {
        await this.admin.createTopics({ waitForLeaders: true, timeout: 5000, topics: [{ topic, numPartitions: 1 }] });
        console.log("topic created... ");
      } else {
        console.log("topic already exists... ");
      }
    } catch (error) {
      console.log("TOPIC CREATION ERROR ... ", error);
      process.exit(1);
    }
  }

  async sentToTopic(topic: string, message: string) {
    console.log("TOPIC: ", topic, message);
    try {
      this.producer.send({ topic, messages: [{ value: message }] });
      console.log("message sent to topic... ");
    } catch (error) {
      console.log("topic sent error... ", error);
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
