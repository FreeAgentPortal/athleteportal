import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { FeaturePlan } from '@/layout/billingSetupModal/components/featurePlanCard/FeaturePlanCard.component';

interface PlansState {
  selectedPlans: FeaturePlan[];
  togglePlan: (plan: FeaturePlan) => void;
  /**
   * Temporarily restricts selection to a single plan. Replaces the array with
   * the provided plan or clears it if the plan is already selected. This keeps
   * the store compatible with future multi-plan support.
   */
  selectPlan: (plan: FeaturePlan) => void;
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
  selectPlan: (plan: FeaturePlan) =>
    set((state) => {
      const exists = state.selectedPlans.find((p) => p._id === plan._id);
      return exists ? { selectedPlans: [] } : { selectedPlans: [plan] };
    }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('PlansStore', usePlansStore);
}
