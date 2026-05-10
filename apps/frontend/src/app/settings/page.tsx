import { DemoModulePage } from '../DemoModulePage';

export default function SettingsPage() {
  return <DemoModulePage title="Settings" permission="settings.view" description="Demo settings route for application configuration protected by settings.view." items={["Security", "Integrations", "Deployment"]} />;
}
