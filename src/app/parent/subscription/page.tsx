import { redirect } from "next/navigation";
import { getParent } from "@/lib/auth";
import { getActivePlan } from "@/lib/actions";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { CheckoutBoard } from "@/components/parent-widgets";
export const dynamic = "force-dynamic";
export const metadata = { title: "Subscriptions" };
export default async function SubscriptionPage() {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const plan = await getActivePlan(parent.id);
  return (
    <PageShell wide>
      <ParentNav name={parent.name} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Keep the mail flying</h1>
      <p className="mt-2 text-[#fff6e5]/75">
        Secure family checkout for monthly, annual, or lifetime magic — plus certificates, videos, birthday letters, and mailed parchment.
      </p>
      <div className="mt-6">
        <CheckoutBoard currentPlan={plan.plan} currentAddons={plan.addons} />
      </div>
    </PageShell>
  );
}