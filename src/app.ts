import nico from "@blastz/nico";
import { getRepository } from "typeorm";
import { Transform } from "stream";

import db from "./db";
import { Calendar } from "./db/entities/Calendar";

(async () => {
  await db.connect();

  nico.init({
    routes: {
      "GET /calendars": {
        controller: async (ctx) => {
          const result = await getRepository(Calendar)
            .createQueryBuilder("calendar")
            .where("calendar.id < 100000")
            .getMany();

          return (ctx.body = result);
        },
      },
      "GET /stream-calendars": {
        controller: async (ctx) => {
          const readStream = await getRepository(Calendar)
            .createQueryBuilder("calendar")
            .where("calendar.id < 100000")
            .stream();

          const transform = new Transform({
            transform(chunk, encoding, callback) {
              // @ts-ignore
              if (!this.started) {
                this.push("[");
                // @ts-ignore
                this.started = true;
              } else {
                this.push(",");
              }

              const date = new Date(chunk.calendar_fulldate);

              this.push(
                JSON.stringify({
                  id: chunk.calendar_id,
                  date: `${date.getFullYear()}-${
                    date.getMonth() + 1
                  }-${date.getDate()}`,
                })
              );
              callback();
            },
            flush(callback) {
              // @ts-ignore
              if (!this.started) {
                this.push("[");
              }

              this.push("]");
              callback();
            },
            objectMode: true,
          });

          ctx.set("content-type", "application/json");
          return (ctx.body = readStream.pipe(transform));
        },
      },
    },
  });

  nico.start(1415);
})();
