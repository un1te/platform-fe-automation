import axios from "axios";
import process from "node:process";
import path from "node:path";
import * as fs from "node:fs";

function getCookie(key: string) {
	const authFilePath = ".auth/user.json";
	const filePath = path.resolve(authFilePath);
	const fileContents = fs.readFileSync(filePath, "utf-8");
	const authData = JSON.parse(fileContents);
	return authData.cookies.find((cookie: { name: string; value?: string }) => cookie.name === key)?.value;
}

export async function getToken() {
	const sessionUrl = new URL("api/auth/session", process.env.BASE_URL).toString();
	const response = await axios.get(sessionUrl, {
		headers: {
			"Content-Type": "application/json",
			"Cookie": `__Host-next-auth.csrf-token=${getCookie("__Host-next-auth.csrf-token")}; __Secure-next-auth.session-token=${getCookie("__Secure-next-auth.session-token")}`,
		},
	},
	);
	return response.data.accessToken;
}

export async function getAxiosInstance() {
	return axios.create({
		baseURL: process.env.API_URL,
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${await getToken()}`,
		},
	});
}
