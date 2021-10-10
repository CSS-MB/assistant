import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useSingleSelection } from "plugin-app";

export interface ResponsivePreviewProps {
  type: "responsive";
  /**
   * the vanilla html code or remote embeddable web url;
   */
  data?: string;
  /**
   * show responsive view of.
   */
  of?: string;
}
interface ParentSizeProps {
  w: number;
  h: number;
}

const margin = 12;

export function ResponsivePreview({
  previewInfo,
  parentSize,
}: {
  previewInfo: ResponsivePreviewProps;
  parentSize: ParentSizeProps;
}) {
  // TODO: remove me - temporal use
  const design = useSingleSelection();
  const [scalefactor, setscalefactor] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(undefined);
  useEffect(() => {
    const parent = iframeRef.current.parentElement;
    if (design) {
      if (!(parentSize.h > design.node["height"])) {
        parent.style.height = "min-content";
      }
      if (parentSize.w < design.node["width"]) {
        const _s = (parentSize.w - margin * 2) / design.node["width"];
        const framescale = _s; // Math.min(_s, 1); (disabled. - will be removed @softmarshamllow)
        setscalefactor(framescale);
      } else {
        setscalefactor(1);
        parent.style.display = "flex";
        parent.style.justifyContent = "center";
        parent.style.alignItems = "center";
        parent.style.flexWrap = "wrap";
      }
    }
  }, [design, parentSize.w]);

  // dangerously remove scrolling for inner ifram html
  // ask: @softmarshmallow
  useEffect(() => {
    if (iframeRef.current) {
      __dangerously_disable_scroll_in_html_body(iframeRef.current);
    }
  }, [iframeRef, previewInfo.data, design?.node?.id]);

  return (
    <>
      <PlainIframe
        id="preview-iframe"
        ref={iframeRef}
        width={design?.node["width"] ?? 0}
        height={design?.node["height"] ?? 0}
        sandbox="allow-same-origin"
        margin={margin}
        srcDoc={previewInfo.data}
        scale={scalefactor}
      />
    </>
  );
}

/**
 * this is a explicit temporary solution to disable iframe content to be scrolling. we aleardy disable scrolling a root element inside the body, but when the element is big and the scale factor is not persice enough, the scrollbar will be shown.
 * @ask: @softmarshmallow
 * @param iframe
 */
function __dangerously_disable_scroll_in_html_body(iframe: HTMLIFrameElement) {
  try {
    iframe.contentDocument.getElementsByTagName("body")[0].style.overflow =
      "hidden";
  } catch (_) {}
}

const PlainIframe = styled.iframe<{ scale: number; margin: number }>`
  background: white;
  box-shadow: 0px 4px 64px rgba(160, 160, 160, 0.18);
  outline: none;
  overflow: hidden;
  border-radius: 4px;
  margin: ${(props) => props.margin}px;
  border: none;
  transform: ${(props) => `scale(${props.scale})`};
  transform-origin: 0 0;
  z-index: -1;
`;
