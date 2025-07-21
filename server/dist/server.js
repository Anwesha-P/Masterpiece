"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc")); // Fixed import
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express")); // Fixed import
// To read from the env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3009;
//Enable Cross-Origin Resource Sharing for this application
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Fixed Swagger configuration
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Merchandising Audit API",
            version: "1.0.0",
            description: "API for managing stores, audits, and replenishment orders",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Development server",
            },
        ],
    },
    apis: ["./src/**/*.ts", "./routes/*.ts", __filename], // Include current file for inline docs
};
const specs = (0, swagger_jsdoc_1.default)(options); // Fixed - need to pass options
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
//Establishing database connections using pool help with resource and time management
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
//Test the connection
pool.query('SELECT 1', (err) => {
    if (err) {
        console.error('Database connection failed:', err);
    }
    else {
        console.log('Connected to the database successfully!');
    }
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: Store001
 *         storeName:
 *           type: string
 *           example: Green Bay Horticulture
 *         Address:
 *           type: string
 *           example: 3345 Belton ST, Green Bay, WI
 *     Threshold:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           example: SKU005
 *         threshold:
 *           type: integer
 *           example: 10
 *
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: uuidv4()
 *         storeid:
 *           type: string
 *           example: Store001
 *         sku:
 *           type: string
 *           example: SKU004
 *         quantity:
 *           type: integer
 *           example: 6
 *         condition:
 *           type: string
 *           example: Fair
 *         timestamp:
 *           type: date-time
 *           example: 2024-07-17 10:30:00
 *
 *     ReplenishmentOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: uuidv4()
 *         storeid:
 *           type: string
 *           example: Store001
 *         sku:
 *           type: string
 *           example: SKU005
 *         quantityNeeded:
 *           type: integer
 *           example: 5
 *         createdAt:
 *           type: date-time
 *           example: 2024-07-17 10:30:00
 */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check if API is running
 *     description: Returns a simple message to confirm the API is operational
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Merchandising Audit API is running."
 */
app.get("/", (_req, res) => {
    res.send("Merchandising Audit API is running.");
});
/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     description: Retrieve a list of all stores
 *     responses:
 *       200:
 *         description: List of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
app.get("/stores", (_req, res) => {
    const sql = "SELECT * FROM Stores";
    pool.query(sql, (err, result) => {
        if (err)
            return res.json(err);
        return res.status(200).json(result.rows);
    });
});
/**
 * @swagger
 * /thresholds/{sku}:
 *   get:
 *     summary: Get threshold by SKU
 *     description: Retrieve threshold information for a specific SKU
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: The product SKU
 *     responses:
 *       200:
 *         description: Threshold information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Threshold'
 *       500:
 *         description: Database error
 */
app.get("/thresholds/:sku", (req, res) => {
    const sku = req.params.sku;
    const sql = "SELECT * FROM Thresholds WHERE sku = $1";
    pool.query(sql, [sku], (err, result) => {
        if (err)
            return res.json(err);
        return res.status(200).json(result.rows);
    });
});
/**
 * @swagger
 * /audit:
 *   post:
 *     summary: Create audit log
 *     description: Create a new audit log entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeid
 *               - sku
 *               - quantity
 *               - condition
 *             properties:
 *               storeid:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               condition:
 *                 type: string
 *     responses:
 *       201:
 *         description: Audit log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       500:
 *         description: Database error
 */
app.post("/audit", (req, res) => {
    const { storeid, sku, quantity, condition } = req.body;
    //Each created row has a unique ID
    const id = (0, uuid_1.v4)();
    const sql = "INSERT INTO AuditLogs(id, storeId, sku, quantity, condition) VALUES ($1, $2, $3, $4, $5)";
    pool.query(sql, [id, storeid, sku, quantity, condition], (err, _result) => {
        if (err)
            return res.json(err);
        return res.status(201).json({ message: "Audit log created", id });
    });
});
/**
 * @swagger
 * /audit/{storeid}:
 *   get:
 *     summary: Get audit logs by store ID
 *     description: Retrieve all audit logs for a specific store
 *     parameters:
 *       - in: path
 *         name: storeid
 *         required: true
 *         schema:
 *           type: string
 *         description: The store ID
 *     responses:
 *       200:
 *         description: List of audit logs for the store
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 *       500:
 *         description: Database error
 */
app.get("/audit/:storeid", (req, res) => {
    const storeid = req.params.storeid;
    const sql = "SELECT * FROM AuditLogs WHERE storeId = $1";
    pool.query(sql, [storeid], (err, result) => {
        if (err)
            return res.json(err);
        return res.status(200).json(result.rows);
    });
});
/**
 * @swagger
 * /replenishment:
 *   post:
 *     summary: Create replenishment order
 *     description: Create a new replenishment order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeid
 *               - sku
 *               - quantityNeeded
 *               - createdAt
 *             properties:
 *               storeid:
 *                 type: string
 *               sku:
 *                 type: string
 *               quantityNeeded:
 *                 type: integer
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Replenishment order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       500:
 *         description: Database error
 */
app.post("/replenishment", (req, res) => {
    const { storeid, sku, quantityNeeded, createdAt } = req.body;
    const id = (0, uuid_1.v4)();
    const sql = "INSERT INTO ReplenishmentOrders(id, storeId, sku, quantityNeeded) VALUES ($1, $2, $3, $4)";
    pool.query(sql, [id, storeid, sku, quantityNeeded], (err, _result) => {
        if (err)
            return res.json(err);
        return res.status(201).json({ message: "Replenishment Orders log created", id });
    });
});
app.listen(port, () => {
    console.log(`Server is running successfully on port: ${port}`);
    console.log(`Swagger documentation available at: http://localhost:${port}/api-docs`);
});
