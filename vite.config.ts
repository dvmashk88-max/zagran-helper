import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({base:process.env.GITHUB_ACTIONS?"/zagran-helper/":"/",plugins:[react()],resolve:{alias:{"@":path.resolve(__dirname,".")}},server:{host:"127.0.0.1",port:5173}});
