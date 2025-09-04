const PASSWORD_PREFIX = `currentPassword/`;

const useProjectPassword = (projectId: number) => {
  const getPassword = () => {
    return localStorage.getItem(`${PASSWORD_PREFIX}${projectId}`) || "";
  };

  const setPassword = (newPassword: string) => {
    localStorage.setItem(`${PASSWORD_PREFIX}${projectId}`, newPassword);
  };

  return { getPassword, setPassword };
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
      localStorage.setItem(`${PASSWORD_PREFIX}${projectId}`, password);
    },
  };
};
