import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: new URL("../.env", import.meta.url) });
