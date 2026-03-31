const meetingsUrl = '/meetings';
const newMeetingUrl = '/meetings/new';
const roleIdCISO = 'bbd4222e2d9794226eac253ed0d9e22f'
const roleIdCIO = 'd5fef42de445a1adf564d8ad4bd39d2a'

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
    "status": "started"
};

const statuses = {
    "prepared": "prepared",
    "started": "started",
    "finished": "finished"
}

export default {
    meetingsUrl,
    newMeetingUrl,
    createMeetingRequest,
    statuses,
    startMeetingRequest,
    roleIdCIO,
    roleIdCISO
};