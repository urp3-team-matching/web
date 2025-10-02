"use client";

import apiClient from "@/lib/apiClientHelper";
import { supabase } from "@/lib/supabaseClient";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ProjectVerificationContextType {
  isVerified: boolean | null;
  verifyProject: () => Promise<void>;
  setVerified: (verified: boolean) => void;
}

const ProjectVerificationContext =
  createContext<ProjectVerificationContextType>({
    isVerified: null,
    verifyProject: async () => {},
    setVerified: () => {},
  });

export const useProjectVerification = () => {
  const context = useContext(ProjectVerificationContext);
  if (!context) {
    throw new Error(
      "useProjectVerification must be used within ProjectVerificationProvider"
    );
  }
  return context;
};

export function ProjectVerificationProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: number;
}) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const verifyingRef = useRef(false);
  const lastProjectIdRef = useRef<number | null>(null);

  const verifyProject = async () => {
    if (verifyingRef.current) return; // 이미 검증 중

    verifyingRef.current = true;
    try {
      // 🔹 먼저 Supabase 로그인 상태 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 🔹 로그인된 사용자는 무조건 인증됨
        console.log("User is authenticated with Supabase:", user.email);
        setIsVerified(true);
        return;
      }

      // 🔹 로그인되지 않은 경우에만 프로젝트 비밀번호 검증
      const result = await apiClient.verifyProjectPassword(projectId);
      setIsVerified(result);
      console.log("Project password verification result:", result);
    } catch (error) {
      console.error("Project verification failed:", error);
      setIsVerified(false);
    } finally {
      verifyingRef.current = false;
    }
  };

  // 🔹 수동으로 검증 상태를 설정하는 함수 (AdminSwitch에서 사용)
  const setVerified = (verified: boolean) => {
    setIsVerified(verified);
  };

  // 🔹 프로젝트 ID가 변경되거나 최초 로드 시에만 검증
  useEffect(() => {
    // 같은 프로젝트 ID면 재검증하지 않음
    if (lastProjectIdRef.current === projectId && isVerified !== null) {
      return;
    }

    // 프로젝트 ID가 변경되었거나 최초 로드인 경우
    console.log("Verifying project:", projectId);
    setIsVerified(null);
    verifyingRef.current = false;
    lastProjectIdRef.current = projectId;
    verifyProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 🔹 Supabase 인증 상태 변화 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        // 🔹 로그인 시 즉시 인증됨으로 설정
        console.log("User signed in, setting verified to true");
        setIsVerified(true);
      } else if (event === "SIGNED_OUT") {
        // 🔹 로그아웃 시 재검증 필요
        console.log("User signed out, re-verifying project access");
        setIsVerified(null);
        verifyingRef.current = false;
        verifyProject();
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <ProjectVerificationContext.Provider
      value={{
        isVerified,
        verifyProject,
        setVerified,
      }}
    >
      {children}
    </ProjectVerificationContext.Provider>
  );
}
