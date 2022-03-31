import { HTMLProps, KeyboardEvent } from "react"
import { ErrorMessage } from "../error-message"
import { useStore } from "../global"
import { CheckIcon } from "../icons/check"

export function TextEditor({ className, ...rest }: HTMLProps<HTMLDivElement>) {
    const store = useStore()
    const isTui = store(({ type }) => type === "tui")
    const text = store(({ text }) => text)
    const parseError = store(({ parseError }) => parseError)

    if (!isTui) {
        return null
    }

    return (
        <div {...rest} className={`${className} d-flex position-relative`}>
            <textarea
                autoFocus
                style={{ resize: "none", outline: 0, tabSize: 4 }}
                value={text}
                onKeyDown={(e) => onKeyDown(e, store.getState().setText)}
                spellCheck={false}
                onChange={(e) => store.getState().setText(e.target.value)}
                className="bg-transparent p-0 border-0 flex-basis-0 flex-grow-1 text-light"
            />
            {parseError == null ? (
                <button
                    className="d-flex align-items-center btn btn-primary"
                    style={{ position: "absolute", right: "1rem", bottom: "1rem" }}
                    onClick={() => store.getState().setType("gui")}>
                    <CheckIcon />
                </button>
            ) : (
                <ErrorMessage
                    style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
                    align="right"
                    message={parseError}
                />
            )}
        </div>
    )
}

function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>, setText: (text: string) => void) {
    if (e.code === "Tab") {
        e.preventDefault()
        // tab was pressed

        // get caret position/selection
        var val = e.currentTarget.value,
            start = e.currentTarget.selectionStart,
            end = e.currentTarget.selectionEnd

        // set textarea value to: text before caret + tab + text after caret
        setText(val.substring(0, start) + "\t" + val.substring(end))

        // put caret at right position again
        //e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1

        // prevent the focus lose
        return false
    }
}
