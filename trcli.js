const { exec } = require('child_process');
require('dotenv').config();

const host = process.env.TESTRAIL_URL;
const project = process.env.TESTRAIL_PROJECT_NAME;
const username = process.env.TESTRAIL_USERNAME;
const key = process.env.TESTRAIL_API_KEY;
const suiteId = process.env.TESTRAIL_SUITE_ID;
const junitFile = "./test-results/junit-report.xml";
const title = `Automated Test Run - ${new Date().toLocaleString("sv-SE", { timeZone: "Europe/Kyiv" })}`;

// trcli command
const command = `trcli -n \
 -h ${host} \
  --project "${project}" \
  --username ${username} \
  --key ${key} \
  parse_junit \
  --title "${title}" \
  --suite-id ${suiteId} \
  --case-matcher name \
  -f "${junitFile}" \
   --close-run `;

// Execute the command
exec(command, (error, stdout, stderr) => {
 if (error) {
  console.error(`Error executing command: ${error.message}`);
  return;
 }

 if (stderr) {
  console.error(`stderr: ${stderr}`);
  return;
 }

 console.log(`stdout: ${stdout}`);
});
