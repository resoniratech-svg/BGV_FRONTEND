import { useEffect, useState } from "react";
import { extractArray } from "../utils/safeArray";

import {
  getCandidates
} from "../api/candidateApi";
const FILTER_CONFIG = {

  VERIFIED: [
    "VERIFIED"
  ],

  PENDING: [
    "PENDING",
    "DOCUMENTS_SUBMITTED",
    "DOCUMENTS_UPLOADED",
    "UNDER_VERIFICATION"
  ],

  FRAUD_ALERT: [
    "FRAUD_ALERT"
  ]

};
export const useCandidatesModule = () => {

  const [stats, setStats] =
    useState<any>({});

  const [candidates, setCandidates] =
    useState<any[]>([]);

  const [allCandidates, setAllCandidates] =
    useState<any[]>([]);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const loadCandidates = async () => {

    const rawData = await getCandidates();
    const data = extractArray(rawData);

    setAllCandidates(data);

    setCandidates(data);

    setStats({

  total: data.length,

  verified: data.filter(
    (c: any) =>
      FILTER_CONFIG.VERIFIED.includes(
        c.status
      )
  ).length,

  pending: data.filter(
    (c: any) =>
      FILTER_CONFIG.PENDING.includes(
        c.status
      )
  ).length,

  fraud: data.filter(
    (c: any) =>
      FILTER_CONFIG.FRAUD_ALERT.includes(
        c.status
      )
  ).length

});
  };

  const loadCandidatesByStatus =
  (status: string) => {

    setActiveFilter(status);

    const safeAll = extractArray(allCandidates);

    if (status === "ALL") {

      setCandidates(safeAll);

      return;
    }

    const statuses =
      FILTER_CONFIG[
        status as keyof typeof FILTER_CONFIG
      ];

    if (!statuses) {

      setCandidates([]);

      return;
    }

    setCandidates(
      safeAll.filter(
        (candidate: any) =>
          statuses.includes(
            candidate.status
          )
      )
    );
  };

  useEffect(() => {

    loadCandidates();

  }, []);

  return {

    stats,

    candidates,

    activeFilter,

    loadCandidatesByStatus,

    loadCandidates

  };
};