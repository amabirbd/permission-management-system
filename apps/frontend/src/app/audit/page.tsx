import { DemoModulePage } from '../DemoModulePage';

export default function AuditPage() {
  return <DemoModulePage title="Audit Log" permission="audit.view" description="Demo audit route for reviewing privileged actions. The dashboard already displays recent backend audit entries." items={["Permission updates", "Login events", "Authorization denials"]} />;
}
