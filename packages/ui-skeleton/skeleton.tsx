import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import Skeleton from "@material-ui/lab/Skeleton";

export function AppSkeleton() {
  return (
    <Wrapper>
      <NavigationWrapper>
        <Navigation />
        <Navigation />
      </NavigationWrapper>
      <TabWrapper>
        <Tab />
        <Tab />
        <Tab />
        <Tab />
      </TabWrapper>
      <Skeleton>
        <Preview />
      </Skeleton>

      <ContentsWrapper>
        <Contents />
        <Contents />
        <Contents />
      </ContentsWrapper>
      <ButtonWrapper />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  padding: 22px 16px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavigationWrapper = styled(Row)``;

const Navigation = styled(Skeleton)`
  width: 54px;
  height: 21px !important;

  &:first-child {
    margin-right: 8px;
  }
`;

const TabWrapper = styled(Row)``;

const Tab = styled(Skeleton)`
  width: 54px;
  height: 13px !important;

  margin-right: 8px;

  &:last-child {
    margin-right: 0;
  }
`;

const Preview = styled.div`
  width: 100vw;
  height: 200px !important;
  margin: 0 -16px;
`;

const ContentsWrapper = styled(Column)``;

const Contents = styled(Skeleton)`
  width: 137px;
  height: 8px !important;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonWrapper = styled(Skeleton)`
  width: calc(100vw - 32px);
  height: 48px !important;
  position: absolute;
  bottom: 12px;
  left: 16px;
`;