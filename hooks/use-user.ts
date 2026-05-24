import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { getClientSupabase } from "@/utils/supabase/client";

const useUser = () => {
  const supabase = getClientSupabase();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase.auth]);
  return user;
};

export default useUser;
