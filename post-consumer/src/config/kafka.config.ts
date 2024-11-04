import { Kafka, Admin, Consumer, logLevel, Partitioners } from "kafkajs";
import ip from "ip";

class KafkaConfig {
  private kafka: Kafka;
  private admin: Admin;
  private brokers: string;
  private consumer: Consumer;
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
    this.consumer = this.kafka.consumer({ groupId: "post-consumer" });
  }

  async connect() {
    try {
      await this.consumer.connect();
      console.log("kafka connected... ");
    } catch (error) {
      console.log("kafa connected error... ", error);
    }
  }

  async subscribeTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
    } catch (error) {
      console.log("consumer subscribe error... ", error);
    }
  }

  async consume(cb: (message: any) => void): Promise<void> {
    try {
      this.consumer.run({
        eachMessage: async ({ topic, message, partition }) => {
          console.log("message received...", { topic, partition, message });
          cb(JSON.parse(message?.value?.toString()!));
        },
      });
    } catch (error) {
        console.log("consumer consume error... ", error);
    }
  }

  async disconnect() {
    try {
      this.consumer.disconnect();
    } catch (error) {
      console.log("kafka disconnect error... ");
    }
  }
}

export default new KafkaConfig();
