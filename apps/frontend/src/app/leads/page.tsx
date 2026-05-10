import { DemoModulePage } from '../DemoModulePage';

export default function LeadsPage() {
  return <DemoModulePage title="Leads" permission="leads.view" description="Demo sales lead workspace visible only to users with the leads.view permission atom." items={["New prospects", "Pipeline stages", "Assignment queue"]} />;
}
