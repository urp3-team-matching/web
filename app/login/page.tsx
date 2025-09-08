import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "../../actions/auth";

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4 w-64 mx-auto mt-32">
      <Label htmlFor="email">Email:</Label>
      <Input id="email" name="email" type="email" required />
      <Label htmlFor="password">Password:</Label>
      <Input id="password" name="password" type="password" required />
      <Button formAction={login}>Log in</Button>
      <Button formAction={signup}>Sign up</Button>
    </form>
  );
}
