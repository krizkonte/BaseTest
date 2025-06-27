import BasePopover from "../components/base/BasePopover";
import { BaseButton } from "../components/base/BaseButton";
import BgUtilityTest from "~/components/BgUtilityTest";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4 ">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="space-y-6 px-4">
          <div className="surface-medium rounded-lg space-y-4 p-4 w-fit">
            <BasePopover description="Minha descrição personalizada" />
            <BaseButton>Teste</BaseButton>
            <BaseButton variant="outline">Teste</BaseButton>
            <BaseButton variant="ghost">Teste</BaseButton>
            <BaseButton variant="destructive">Teste</BaseButton>
            <BaseButton variant="destructiveGhost">Teste</BaseButton>
            <BaseButton variant="link">Teste</BaseButton>
          </div>
          <div className="surface-medium rounded-lg space-y-4 p-4 flex  w-fit">
            <BgUtilityTest />
          </div>
        </div>
      </div>
    </main>
  );
}
