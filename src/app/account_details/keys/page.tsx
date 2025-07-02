import PageLayout from "@/layout/page/Page.layout";
import { navigation } from "@/data/navigation";
import ApiKeys from "@/views/apikeys/ApiKeys.view";

export default function Component() {
  return (
    <PageLayout pages={[navigation().account_details.links.keys]}>
      <ApiKeys />
    </PageLayout>
  );
}
