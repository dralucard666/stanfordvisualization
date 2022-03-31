import { AbstractParsedOperation, getLabel, HierarchicalInfo, HierarchicalParsedSteps } from "cgv"
import { HTMLProps } from "react"
import { useStore } from "../global"
import { CheckIcon } from "../icons/check"
import { DeleteIcon } from "../icons/delete"
import { GUINounStep } from "./noun"
import { GUIOperation } from "./operation"
import { GUIRawStep } from "./raw"

export type OperationGUIMap = {
    [name in string]?: (props: { value: AbstractParsedOperation<HierarchicalInfo> }) => JSX.Element | null
}

export function GUI({ className, ...rest }: HTMLProps<HTMLDivElement>) {
    const store = useStore()
    const selected = store(({ selected }) => selected)
    if (selected == null) {
        return null
    }
    return (
        <div {...rest} className={`${className} d-flex flex-column px-0 pt-2 overflow-hidden`}>
            <div className="d-flex flex-column">
                <h3 className="p-0 mx-3 mb-3">{typeof selected === "string" ? selected : getLabel(selected)}</h3>
                <div className="btn-group mx-3 mb-2 d-flex">
                    <button
                        onClick={store.getState().openStepDescriptorDialog.bind(null, "before")}
                        className="btn btn-sm btn-outline-success flex-grow-1 flex-basis-0">
                        + Before
                    </button>
                    <button
                        onClick={store.getState().openStepDescriptorDialog.bind(null, "parallel")}
                        className="btn btn-sm btn-outline-success flex-grow-1 flex-basis-0">
                        + Parllel
                    </button>
                    <button
                        onClick={store.getState().openStepDescriptorDialog.bind(null, "after")}
                        className="btn btn-sm btn-outline-success flex-grow-1 flex-basis-0">
                        + After
                    </button>
                </div>
                <div className="btn-group mx-3 mb-3 d-flex">
                    <button
                        onClick={store.getState().select.bind(null, undefined)}
                        className="d-flex align-items-center justify-content-center btn btn-sm btn-outline-primary flex-grow-1 flex-basis-0">
                        <CheckIcon/>
                    </button>
                    {typeof selected !== "string" && (
                        <button
                            onClick={store.getState().openStepDescriptorDialog.bind(null, "replace")}
                            className="btn btn-sm btn-outline-secondary flex-grow-1 flex-basis-0">
                            Replace
                        </button>
                    )}
                    <button
                        onClick={store.getState().remove.bind(null, undefined)}
                        className="d-flex align-items-center justify-content-center btn btn-sm btn-outline-danger flex-grow-1 flex-basis-0">
                        <DeleteIcon/>
                    </button>
                </div>
                <GUISteps value={selected} />
            </div>
        </div>
    )
}

function GUISteps({ value }: { value: HierarchicalParsedSteps | string }): JSX.Element | null {
    if (typeof value === "string") {
        return <GUINounStep value={value} />
    }
    switch (value.type) {
        case "raw":
            return <GUIRawStep value={value} />
        case "operation": {
            return <GUIOperation value={value} />
        }
        default:
            return null
    }
}
