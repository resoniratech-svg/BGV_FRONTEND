import { useEffect, useState } from "react";
import { reportService } from "../services/reportService";
import type { Report } from "../types/Report";

export const useReports = () => {

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {

    try {

      setLoading(true);

      const data =
        await reportService.getReports();

      setReports(data);

    } catch (err: any) {

      setError(
        err?.message || "Failed to load reports"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchReports();

  }, []);

  return {
    reports,
    loading,
    error,
    refresh: fetchReports
  };
};