import {getAxiosInstance} from "./utils/axiosInstance";
import data from "../test_data/meetingListingPageData";

/**
 * Helper class for making API calls to the backend.
 * Handles meeting-related operations and abstracts away axios configuration.
 */
export class APIHelper {

    /**
     * Delete all meetings for the current user
     */
    async deleteAllMeetings(): Promise<void> {
        const axiosInstance = await getAxiosInstance();
        await axiosInstance.delete('/meetings/all');
    }

    /**
     * Delete a specific meeting by ID
     * @param id - Meeting ID to delete
     */
    async deleteMeetingById(id: string): Promise<void> {
        const axiosInstance = await getAxiosInstance();
        await axiosInstance.delete('/meetings/' + id);
    }

    /**
     * Create a new meeting(s)
     * @param meetingsNumber - Number of meetings to create (default: 1)
     * @returns Meeting ID if creating single meeting, 0 if creating multiple
     */
    async createNewMeeting(meetingsNumber: number = 1): Promise<number> {
        const axiosInstance = await getAxiosInstance();
        
        if (meetingsNumber === 1) {
            const response = await axiosInstance.post('/meetings', data.createMeetingRequest);
            return response.data.id;
        } else {
            for (let i = 0; i < meetingsNumber; i++) {
                await axiosInstance.post('/meetings', data.createMeetingRequest);
            }
            return 0;
        }
    }

    /**
     * Start a specific meeting
     * @param meetingId - ID of the meeting to start
     */
    async startMeeting(meetingId: number): Promise<void> {
        const axiosInstance = await getAxiosInstance();
        await axiosInstance.patch('/meetings/' + meetingId, data.startMeetingRequest);
    }
}
