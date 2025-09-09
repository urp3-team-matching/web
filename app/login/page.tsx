import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "../../actions/auth";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4 w-64 mx-auto mt-32">
      <h1 className="text-2xl font-bold text-center mb-5">관리자 로그인</h1>

      <Label htmlFor="email">이메일:</Label>
      <Input id="email" name="email" type="email" required />

      <Label htmlFor="password">비밀번호:</Label>
      <Input id="password" name="password" type="password" required />

      <Button formAction={login} variant="secondary">
        로그인
      </Button>
    </form>
  );
}
