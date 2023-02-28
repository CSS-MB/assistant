import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { PluginSdk } from "@plugin-sdk/app";

const __key = "assistant-early-access-activation";

export function RegisterWithCodeCard() {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    PluginSdk.getItem(__key).then((code) => {
      verify(code).then((verified) => {
        setVerified(verified);
      });
    });
  }, []);

  const verify = async (code?: string) => {
    if (!code) {
      return false;
    }

    if (!code.startsWith("GAEBAK-")) {
      return false;
    }

    //
    // TODO: add server side verification

    return true;
  };

  const activate = (code: string) => {
    verify(code).then((verified) => {
      if (verified) {
        PluginSdk.setItem(__key, code);
        setVerified(true);
        alert("Congrats🎉 Early access program activated.");
      } else {
        alert("Hmm🤔 That's not a valid access key");
      }
    });
  };

  return (
    <>
      <RootWrapperEnterAccessKeyCard>
        {verified ? (
          <>
            <Heading>Activated</Heading>
          </>
        ) : (
          <>
            <Heading>Enter your Access Key</Heading>
            <Paragraph>
              Please enter your early bird access key. It can be found at
            </Paragraph>
            <Field
              onSubmit={(e) => {
                e.preventDefault();
                const totp = e.target["topt"].value;
                activate(totp);
              }}
            >
              <KeyAsInput
                id="topt"
                type="text"
                // the length is 39 (prefix 6) value 32
                maxLength={50}
                minLength={24}
                placeholder="xxxxxx-xxxxxxxxxxxxx"
              />
              <EnterAsButton>Enter</EnterAsButton>
            </Field>
          </>
        )}
      </RootWrapperEnterAccessKeyCard>
    </>
  );
}

const RootWrapperEnterAccessKeyCard = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  flex: none;
  gap: 28px;
  box-shadow: 0px 4px 48px 24px rgba(0, 0, 0, 0.04);
  border: solid 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  box-sizing: border-box;
  padding: 37px 30px;
`;

const Heading = styled.span`
  color: rgba(0, 0, 0, 0.8);
  text-overflow: ellipsis;
  font-size: 21px;
  font-family: Inter, sans-serif;
  font-weight: 700;
  text-align: center;
`;

const Paragraph = styled.span`
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  line-height: 96%;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
  max-width: 260px;
`;

const Field = styled.form`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-start;
  flex: none;
  gap: 13px;
  box-sizing: border-box;
`;

const KeyAsInput = styled.input`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.02);
  border: solid 1px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  padding: 10px 16px;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.5);
  font-size: 18px;
  font-family: "Roboto Mono", sans-serif;
  font-weight: 400;
  text-align: start;

  ::placeholder {
    color: rgba(0, 0, 0, 0.5);
    font-size: 18px;
    font-family: "Roboto Mono", sans-serif;
    font-weight: 400;
  }
`;

const EnterAsButton = styled.button`
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
  padding: 10px 16px;
  color: white;
  font-size: 18px;
  font-family: "Roboto Mono", sans-serif;
  font-weight: 500;
  border: none;
  outline: none;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :disabled {
    opacity: 0.5;
  }

  :active {
    opacity: 1;
  }

  :focus {
  }
`;
