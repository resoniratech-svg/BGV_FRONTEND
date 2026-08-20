import { getAllReports } from "../api/reportApi";

export const reportService = {

  async getReports() {

    const response = await getAllReports();

    return response?.data || [];
  }
};