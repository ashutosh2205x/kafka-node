list all brokers : echo dump | nc localhost 2181 | grep brokers

# STEPS

# 1. zookeeper- docker run -p 2181:2181 zookeeper
# 2. docker compose up
# 3. npm run dev