import { createConnection, getConnection } from "typeorm";
import { Calendar } from "./entities/Calendar";

class DB {
  async connect() {
    await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3318,
      username: "root",
      password: "admin123",
      database: "big-base",
      entities: [Calendar],
    });
  }

  async disconnect() {
    await getConnection().close();
  }
}

export default new DB();
