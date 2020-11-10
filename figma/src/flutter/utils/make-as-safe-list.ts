import { Container, Widget } from "@bridged.xyz/flutter-builder";

export function makeSafelyAsList<T>(maybeList: Array<T> | T): Array<T> {
    if (Array.isArray(maybeList)) {
        return maybeList;
    } else {
        return [maybeList]
    }
}


// https://github.com/flutter/flutter/issues/49631#issuecomment-582090992
export function makeSafelyAsStackList(maybeWidgets: Array<Widget> | Widget): Array<Widget> {
    const list = makeSafelyAsList<Widget>(maybeWidgets);
    list.push(new Container())
    return list
}