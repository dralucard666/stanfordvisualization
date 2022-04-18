import { AbstractParsedOperation, HierarchicalInfo, ParsedSteps } from "cgv"
import { Draft } from "immer"
import { useBaseStore } from "../../../global"
import { BlurInput } from "../../../gui/blur-input"

export function GUIVector3<Type extends ParsedSteps["type"]>({
    value,
    getSubstep,
    className,
    defaultValue,
}: {
    defaultValue: number
    className: string
    getSubstep: (draft: Draft<ParsedSteps & { type: Type }>) => Draft<ParsedSteps>
    value: AbstractParsedOperation<HierarchicalInfo>
}) {
    const x = value.children[0].type === "raw" ? value.children[0].value : undefined
    const y = value.children[1].type === "raw" ? value.children[1].value : undefined
    const z = value.children[2].type === "raw" ? value.children[2].value : undefined
    const store = useBaseStore()

    const update = (index: number, number: number) =>
        store.getState().replace<Type>((draft) => {
            const subDraft = getSubstep(draft)
            if (subDraft.type !== "operation") {
                return
            }
            subDraft.children[index] = {
                type: "raw",
                value: number,
            }
        })
    return (
        <div className={className}>
            <BlurInput
                value={x ?? defaultValue}
                type="number"
                className="flex-grow-1 me-2 flex-basis-0 form-control form-control-sm"
                onBlur={(e) => update(0, e.target.valueAsNumber)}
            />
            <BlurInput
                value={y ?? defaultValue}
                type="number"
                className="flex-grow-1 me-2 flex-basis-0 form-control form-control-sm"
                onBlur={(e) => update(1, e.target.valueAsNumber)}
            />
            <BlurInput
                value={z ?? defaultValue}
                type="number"
                className="flex-grow-1 flex-basis-0 form-control form-control-sm"
                onBlur={(e) => update(2, e.target.valueAsNumber)}
            />
        </div>
    )
}
