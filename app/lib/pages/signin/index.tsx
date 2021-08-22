import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  startAuthenticationWithSession,
  startAuthenticationSession,
  checkAuthSession,
} from "../../auth";
import { AuthProxySessionStartResult } from "@base-sdk-fp/auth";
import {
  BlackButton,
  ButtonStyle,
  Column,
  WhtieButton,
} from "../../components/style/global-style";
import { useHistory } from "react-router";
import {
  BackIcon,
  BtnWrapper,
  Contents,
  Inner,
  LinkContents,
  LinkWrapper,
  SignInBtn,
  SignUpBtn,
  Title,
  Wrapper,
} from "./style";
import { PluginSdk } from "@plugin-sdk/app";

// onClick={() => {
//   startAuthentication();
// }}

function LeftArrow() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
        fill="black"
      />
    </svg>
  );
}

function InitialStateContent() {
  return (
    <>
      <Title>Sign in to Grida</Title>
      <Contents>
        For automatic image hosting,
        <br />
        sharing code and much more.
      </Contents>
    </>
  );
}

function LoadingContents(props: {
  authUrl: string;
  onCheckAuth: () => void;
  showUserOptions: boolean;
}) {
  return (
    <>
      <Title>
        Complete your
        <br />
        steps on browser
      </Title>
      <Contents>
        Complete sign-in on your browser, if it still
        <br />
        doesn’t work after you sign-in, Press the
        <br />
        link below.
      </Contents>
      <LinkWrapper>
        {props.showUserOptions && (
          <>
            <LinkContents>
              👉 Let me in, I’ve completed all steps on the browser.
            </LinkContents>
            <LinkContents href={props.authUrl} target="_blank">
              👉 Open the sign-in page again
            </LinkContents>
          </>
        )}
      </LinkWrapper>
    </>
  );
}

function FinishCheckingAuth(props: { username: string }) {
  return (
    <>
      <Title>
        Welcome <br />
        {`${props.username} :)`}
      </Title>
      <Contents>
        Ready to build world-shaking
        <br />
        products with us?
      </Contents>
    </>
  );
}

function Signin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionInfo, setSessionInfo] = useState<AuthProxySessionStartResult>();
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const history = useHistory();

  const close = () => {
    history.goBack();
  };

  return (
    <Wrapper>
      <BackIcon onClick={close}>
        <LeftArrow />
      </BackIcon>
      <Inner>
        {!isAuthenticated ? (
          !isLoading ? (
            <InitialStateContent />
          ) : (
            <LoadingContents
              authUrl={sessionInfo?.authUrl}
              showUserOptions={sessionStarted}
              onCheckAuth={() => {
                PluginSdk.notify(
                  "Checking if you signed in via browser..",
                  1.5
                );
                checkAuthSession(sessionInfo.id).then((authenticated) => {
                  if (authenticated) {
                    setIsAuthenticated(true);
                  }
                });
              }}
            />
          )
        ) : (
          <FinishCheckingAuth username="" /> // TODO: change with authenticated user name (use fetch user profile)
        )}
        <BtnWrapper>
          {isAuthenticated ? (
            <>
              <StyledButton onClick={close}>Aaaallll Right !</StyledButton>
            </>
          ) : (
            <>
              <SignInBtn
                disabled={isLoading}
                onClick={() => {
                  setSessionStarted(false); // session is not yet started. (session start triggered.)
                  setIsLoading(true);
                  startAuthenticationSession()
                    .then((s) => {
                      setSessionStarted(true);
                      open(s.authUrl); // open browser initially.
                      setSessionInfo(s);
                      startAuthenticationWithSession(s).then((d) => {
                        setIsAuthenticated(true);
                      });
                    })
                    .catch((_) => {
                      console.log(
                        "error occured while requesting proxy auth session start",
                        _
                      );
                      PluginSdk.notify(
                        "please try again. (check your internet connection)"
                      );
                      setIsLoading(false);
                    });
                }}
              >
                {!isLoading ? "Sign in" : "Sign in ..."}
              </SignInBtn>
              <SignUpBtn
                onClick={() => {
                  open("https://accounts.grida.co/signup");
                  // clear states
                  setIsLoading(false);
                }}
              >
                Sign Up
              </SignUpBtn>
            </>
          )}
        </BtnWrapper>
      </Inner>
    </Wrapper>
  );
}

/**
 * TODO: migrate this under base-sdk
 */
function fetchUserProfile(): {
  id: string;
  username: string;
  email: string;
} {
  return;
}

const StyledButton = styled.button`
  ${ButtonStyle}
  width: calc(100vw - 54px);
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  background: #2562ff;
  margin-bottom: 53px;
`;

export default Signin;
