import React from "react";
import styled from "styled-components";
import formImg from "../../assets/images/welcome/request.png";

import { AppButton } from "../../features/AppButton/AppButton";

const FORM_URL = "https://forms.yandex.ru/someform"; // <- замените на вашу форму

export const RequestPage: React.FC = () => {
  const openForm = () => {
    window.open(FORM_URL, "_blank");
  };

  return (
    <Page>
      <ImgWrapper>
        <img src={formImg} alt="Request" />
      </ImgWrapper>

      <Title>Заполни заявку</Title>

      <Description>
        Открой форму и заполни заявку, чтобы повысить уровень и получать призы
      </Description>

      <AppButton onClick={openForm}>Открыть форму</AppButton>
    </Page>
  );
};

/* =========================
   STYLES
========================= */

const Page = styled.div`
  height: 100vh;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 600px;
`;

const ImgWrapper = styled.div`
  width: 200px;
  height: 200px;
  margin-bottom: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 16px;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 14px;
  margin-bottom: 32px;
  color: #9b9b9b;
`;
