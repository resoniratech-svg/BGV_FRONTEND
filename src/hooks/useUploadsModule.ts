import { useEffect, useState } from "react";

import {
  getCandidates
} from "../api/candidateApi";

const FILTER_CONFIG = {

  AWAITING_UPLOAD: [
    "REQUEST_SENT"
  ],

  UPLOAD_COMPLETE: [
    "DOCUMENTS_SUBMITTED",
    "DOCUMENTS_UPLOADED",
    "UNDER_VERIFICATION"
  ]

};

export const useUploadsModule = () => {

  const [stats, setStats] =
    useState<any>({});

  const [candidates, setCandidates] =
    useState<any[]>([]);

  const [allCandidates, setAllCandidates] =
    useState<any[]>([]);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const loadCandidates = async () => {

    const data =
      await getCandidates();

    const uploadPhaseCandidates =
      data.filter(
        (candidate: any) =>
          candidate.status !== "PENDING"
      );

    setAllCandidates(
      uploadPhaseCandidates
    );

    setCandidates(
      uploadPhaseCandidates
    );

    setStats({

      total:
        uploadPhaseCandidates.length,

      uploadComplete:
        uploadPhaseCandidates.filter(
          (candidate: any) =>
            FILTER_CONFIG.UPLOAD_COMPLETE.includes(
              candidate.status
            )
        ).length,

      awaitingUpload:
        uploadPhaseCandidates.filter(
          (candidate: any) =>
            FILTER_CONFIG.AWAITING_UPLOAD.includes(
              candidate.status
            )
        ).length

    });
  };

  const loadCandidatesByStatus =
    (status: string) => {

      setActiveFilter(status);

      if (status === "ALL") {

        setCandidates(
          allCandidates
        );

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
        allCandidates.filter(
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