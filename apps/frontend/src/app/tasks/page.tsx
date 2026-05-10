import { DemoModulePage } from '../DemoModulePage';

export default function TasksPage() {
  return <DemoModulePage title="Tasks" permission="tasks.view" description="Demo task management route for assigned operational work and manager reviews." items={["Open tasks", "Team workload", "Due this week"]} />;
}
