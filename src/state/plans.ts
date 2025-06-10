import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { FeaturePlan } from '@/layout/billingSetupModal/components/featurePlanCard/FeaturePlanCard.component';

interface PlansState {
  selectedPlans: FeaturePlan[];
  togglePlan: (plan: FeaturePlan) => void;
}

export const usePlansStore = create<PlansState>((set) => ({
  selectedPlans: [],
  togglePlan: (plan: FeaturePlan) =>
    set((state) => {
      const exists = state.selectedPlans.find((p) => p._id === plan._id);
      return exists
        ? { selectedPlans: state.selectedPlans.filter((p) => p._id !== plan._id) }
        : { selectedPlans: [...state.selectedPlans, plan] };
    }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('PlansStore', usePlansStore);
}
