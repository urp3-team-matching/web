import { useEffect, useState } from "react";

const useProjectPassword = (projectId: number) => {
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const storedPassword = localStorage.getItem(`currentPassword/${projectId}`);
    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, [projectId]);

  const savePassword = (newPassword: string) => {
    setPassword(newPassword);
    localStorage.setItem(`currentPassword/${projectId}`, newPassword);
  };

  return { password, setPassword: savePassword };
};

export default useProjectPassword;

/**
 * 프로젝트 ID 없이 비밀번호를 설정할 수 있는 훅
 * 이 훅은 프로젝트 생성 시 비밀번호를 설정하는 데 사용됩니다.
 * 프로젝트 ID가 필요하지 않으므로, 프로젝트 생성 후에 비밀번호를 저장하는 용도로 사용됩니다.
 */
export const useSetProjectPassword = () => {
  return {
    setPassword: (projectId: number, password: string) => {
      localStorage.setItem(`password/${projectId}`, password);
    },
  };
};
