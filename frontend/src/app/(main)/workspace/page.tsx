import { redirect } from "next/navigation";

// Backward compatibility redirect
export default function WorkspaceRedirect() {
  redirect("/workspaces");
}
