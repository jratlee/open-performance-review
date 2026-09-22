import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use((req, _res, next) => {
  req.setTimeout(5_000);
  next();
});
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api", router);

app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  req.log.error({ err: err instanceof Error ? err.message : "unknown_error" }, "request failed");
  if (res.headersSent) return;
  res.status(500).json({ error: "The request could not be completed." });
});

export default app;
