import { stores } from "@/globalConstant";
import { Dialog, DialogContent } from "@/shadcn/components/ui";
import { useDispatch, useSelect } from "@wordpress/data";
import BlockLists from "./BlockLists";

export function BlockListsModal() {
  const { collapsed } = useSelect((select) =>
    select(stores?.addons).getAddonBuilderState()
  );
  const { setAddonBuilderState } = useDispatch(stores?.addons);

  return (
    <Dialog
      open={collapsed}
      onOpenChange={(open) => setAddonBuilderState({ collapsed: open })}
    >
      <DialogContent className="w-[95vw] max-w-xl" closeButton={false}>
        <BlockLists />
      </DialogContent>
    </Dialog>
  );
}
