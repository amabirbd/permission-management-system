import { DemoModulePage } from '../DemoModulePage';

export default function UsersPage() {
  return <DemoModulePage title="Users" permission="users.view" description="A demo users route for role-aware navigation. The main dashboard contains the working permission editor." items={["User directory", "Invite flow", "Status management"]} />;
}
