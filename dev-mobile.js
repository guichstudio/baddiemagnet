const { execSync } = require("child_process");
const qrcode = require("qrcode-terminal");
const { networkInterfaces } = require("os");

// Find local IP
const nets = networkInterfaces();
let ip = "localhost";
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === "IPv4" && !net.internal) {
      ip = net.address;
      break;
    }
  }
  if (ip !== "localhost") break;
}

const port = 3000;
const url = `http://${ip}:${port}`;

console.log("\n");
console.log("  ╔══════════════════════════════════════════╗");
console.log("  ║         BREAKUP TIME — Dev Server        ║");
console.log("  ╠══════════════════════════════════════════╣");
console.log(`  ║  Local:    http://localhost:${port}          ║`);
console.log(`  ║  Network:  ${url.padEnd(29)}║`);
console.log("  ╚══════════════════════════════════════════╝");
console.log("\n  Scan this QR code with your phone:\n");

qrcode.generate(url, { small: true }, (code) => {
  console.log(
    code
      .split("\n")
      .map((l) => "  " + l)
      .join("\n")
  );
  console.log(`\n  → ${url}\n`);
  console.log("  Phone not connecting? Check:");
  console.log("  • Same WiFi network as this Mac");
  console.log("  • No VPN active on either device");
  console.log("  • macOS Firewall allows incoming connections");
  console.log("    (System Settings → Network → Firewall → Options)");
  console.log("");
});
