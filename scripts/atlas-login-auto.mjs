import pty from "node-pty";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const atlas = path.join(__dirname, "../tools/atlas/bin/atlas.exe");

const term = pty.spawn(atlas, ["auth", "login", "--noBrowser"], {
  name: "xterm-color",
  cols: 120,
  rows: 30,
  cwd: path.dirname(atlas),
});

let buffer = "";
const timeout = setTimeout(() => {
  console.error("Timeout waiting for Atlas login");
  term.kill();
  process.exit(1);
}, 120000);

term.onData((data) => {
  process.stdout.write(data);
  buffer += data;
  if (buffer.includes("Select authentication type")) {
    term.write("\r");
    setTimeout(() => term.write("\r"), 200);
  }
  if (buffer.includes("logged in") || buffer.includes("Success")) {
    clearTimeout(timeout);
    term.kill();
    process.exit(0);
  }
});

term.onExit(({ exitCode }) => {
  clearTimeout(timeout);
  process.exit(exitCode ?? 1);
});
