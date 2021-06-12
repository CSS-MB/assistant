import * as React from "react";
import {
  default as PrismHighlight,
  defaultProps,
  Language,
} from "prism-react-renderer";
import copy from "copy-to-clipboard";
import "./highlight.css";
import { assistant as analytics } from "@analytics.bridged.xyz/internal";

// region custom dart support
// https://github.com/FormidableLabs/prism-react-renderer/issues/22#issuecomment-553042928
import Prism from "prism-react-renderer/prism";
import dartLang from "refractor/lang/dart";
import { quickLook } from "../quicklook";
import { Widget } from "@bridged.xyz/flutter-builder";
import Button from "@material-ui/core/Button";
import { PluginSdk } from "../utils/plugin-provider/plugin-app-sdk";
import { IconButton } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useState } from "react";
dartLang(Prism);
// endregion

interface State {
  isLaunchingConsole: boolean;
}

interface Props {
  language: Language | any;
  code: string;
  app?: string;
  widget?: Widget;
  codeActions?: Array<JSX.Element>;
}

export default function CodeBox(props: Props) {
  const [isLaunchingConsole, setIsLaunchingConsole] = useState<boolean>(false);

  const onCopyClicked = (e) => {
    copy(props.code);
    PluginSdk.notifyCopied();

    // ANALYTICS
    analytics.event_click_copy_code();
  };

  const onQuickLookClicked = (e) => {
    const setLoadingState = (loading: boolean) => {
      setIsLaunchingConsole(loading);
    };

    setLoadingState(true);
    quickLook("quicklook", props.app)
      .then((r) => {
        setLoadingState(false);
        PluginSdk.notify("quick look ready !");
      })
      .catch((e) => {
        console.error(e);
        setLoadingState(false);
        PluginSdk.notify("compile failed. view console for details.", 2);
      });

    // ANALYTICS
    analytics.event_click_quicklook();
  };

  return (
    <>
      <code>
        {props.codeActions &&
          props.codeActions.map((e) => {
            return e;
          })}
        <PrismHighlight
          {...defaultProps}
          Prism={Prism}
          code={props.code}
          language={props.language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </PrismHighlight>
      </code>

      <div className="code-info-wrapper">
        <Button className="btn-copy-code" onClick={onCopyClicked}>
          copy code
        </Button>
        {props.app && (
          <Button
            className="btn-quick-look"
            disabled={isLaunchingConsole}
            onClick={onQuickLookClicked}
          >
            {isLaunchingConsole ? "launching.." : "quick look"}
          </Button>
        )}
      </div>
    </>
  );
}
