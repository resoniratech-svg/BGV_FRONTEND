import { useEffect, useState } from "react";

import {
  getModuleStatistics,
  getCandidatesByStatus
} from "../api/verificationSummaryApi";

export const useVerificationModule = (
  moduleName: string
) => {

  const [stats, setStats] =
    useState<any>({});

  const [candidates, setCandidates] =
    useState<any[]>([]);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const loadStats = async () => {

    const data =
      await getModuleStatistics(
        moduleName
      );

    setStats(data);
  };

  const loadCandidatesByStatus =
    async (
      status: string
    ) => {

      setActiveFilter(status);

      if (status === "ALL") {

  const verified =
    await getCandidatesByStatus(
      moduleName,
      "Verified"
    );

  const pending =
    await getCandidatesByStatus(
      moduleName,
      "PENDING_REVIEW"
    );

  const fraud =
    await getCandidatesByStatus(
      moduleName,
      "Fraud"
    );

  setCandidates([
    ...verified,
    ...pending,
    ...fraud
  ]);

  return;
}

      const data =
        await getCandidatesByStatus(
          moduleName,
          status
        );

      setCandidates(data);
    };

  useEffect(() => {

    loadStats();

    loadCandidatesByStatus(
      "ALL"
    );

  }, [moduleName]);

  return {

    stats,

    candidates,

    activeFilter,

    loadCandidatesByStatus,

    loadStats

  };
};