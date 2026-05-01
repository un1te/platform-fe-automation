const meetingsUrl = "/meetings";
const newMeetingUrl = "/meetings/new";
const roleIdCISO = "0d9e22f";
const roleIdCIO = "bd39d2a";

function getRandomTestName(): string {
	const name = "test";
	const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
	return name + randomNumbers;
}
const createMeetingRequest = {
	"employeeName": getRandomTestName(),
	"employeeRole": getRandomTestName(),
	"roleId": roleIdCISO,
	"companyName": getRandomTestName(),
	"industryName": getRandomTestName(),
};

const startMeetingRequest = {
	"status": "started",
};

const statuses = {
	"prepared": "prepared",
	"started": "started",
	"finished": "finished",
};

export default {
	meetingsUrl,
	newMeetingUrl,
	createMeetingRequest,
	statuses,
	startMeetingRequest,
	roleIdCIO,
	roleIdCISO,
};
