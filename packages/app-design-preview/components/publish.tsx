import React from "react";
import styled from "@emotion/styled";
import { UploadSteps } from "@ui/flow-steps";
import { BlackButtonStyle } from "@ui/core/button-style";

function OpenInBrowserSteps() {
  return (
    <UploadSteps
      onComplete={{
        title: "Your page is ready",
        description: "Note: anyone with the link can access the page.",
        actions: (
          <FooterActionsWrapper>
            <OpenButton>Open</OpenButton>
            <CopyLinkButton>Copy link</CopyLinkButton>
          </FooterActionsWrapper>
        ),
      }}
    />
  );
}

const FooterActionsWrapper = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 16px;
  bottom: 16px;
  right: 0;
  left: 0;
`;

const OpenButton = styled.button`
  ${BlackButtonStyle}
  width: 100%;
`;

const CopyLinkButton = styled.button`
  cursor: pointer;
  outline: none;
  border: none;
  background: none;
  color: rgb(193, 193, 193);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: center;
`;
