import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import http from "http";
import {errorHandler} from "./utils/middlewares/error-handler.middleware";
import {rateLimiter} from "./utils/middlewares/rate-limiter.middleware"
import {loggerMiddleware} from "./utils/middlewares/logger.middleware"
import { router as Routes } from "./routes/index";
import { databaseConnection, sequelize } from "./config/database.connection";
import DOT_ENV from "./config-env";

export class App {
  public app: express.Application;
  public port: string | number;
  private server: any;

  constructor() {
    this.app = express();
    this.port = DOT_ENV.PORT || 7000;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.server = this.createServer();
  }

  private createTables = async () => {
    try {
      await sequelize.sync({ alter : true , logging: console.log });
      console.log("Tables created successfully!");
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  };

  private initializeMiddlewares() {
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: "*",
      })
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(
      express.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 20000,
      })
    );
    this.app.use(cookieParser());
    this.app.use(loggerMiddleware);
    this.app.use(rateLimiter);
  }

  private async initializeRoutes() {
    this.app.use("/", Routes);
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  private createServer() {
    return http.createServer(this.app);
  }

  // Start the server
  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App is listening on port ${this.port}`);

      // this.createTables();   // UNCOMMENT THIS AND RUN THE APP SYNC THE DATABASE WITH CURRENT MODEL
      databaseConnection();
    });
    return this.server;
  }
}

