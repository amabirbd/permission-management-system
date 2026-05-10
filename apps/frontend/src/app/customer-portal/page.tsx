import { DemoModulePage } from '../DemoModulePage';

export default function CustomerPortalPage() {
  return <DemoModulePage title="Customer Portal" permission="customer_portal.view" description="Demo customer-facing workspace route controlled by the customer_portal.view permission atom." items={["Customer profile", "Support history", "Portal access"]} />;
}
