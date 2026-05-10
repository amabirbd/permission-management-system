import { DemoModulePage } from '../DemoModulePage';

export default function ReportsPage() {
  return <DemoModulePage title="Reports" permission="reports.view" description="Demo analytics route for permission-gated reporting and exports." items={["Conversion report", "User activity", "Permission coverage"]} />;
}
