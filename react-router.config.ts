import type { Config } from "@react-router/dev/config";
import { getBasename } from "./config/environment";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  basename: getBasename(),
} satisfies Config;
