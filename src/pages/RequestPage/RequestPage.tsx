import React from "react";
import styled from "styled-components";
import formImg from "../../assets/images/welcome/welcome_img1.png";

// import requestImg from "../../assets/images/request/request.png"; // твоя картинка

export const RequestPage: React.FC = () => {
  return (
    <Page>
      <ImgWrapper>
        <img src={formImg} alt="Request" />
      </ImgWrapper>

      <Title>
        Создай заявку
        <br /> на участие
      </Title>

      <Description>
        Заполни короткую форму, чтобы мы могли обработать твою заявку и дать
        доступ к специальным активностям и наградам.
      </Description>

      <Button>Перейти к форме</Button>

      {/* onClick={() => window.open(formUrl, "_blank")} */}
    </Page>
  );
};

/* =========================
   STYLES
========================= */

const Page = styled.div`
  height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
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
  font-size: 20px;
  margin-bottom: 16px;
  font-family: "Disket Mono", monospace;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
  max-width: 400px;
`;

const Button = styled.button`
  font-size: 12px;
  background: #ff5a00;
  width: 100%;
  border: none;
  color: #000;
  font-weight: 700;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-family: "Disket Mono", monospace;
  transition: 0.2s ease;
  outline: none;
  &:hover {
    background: #ff742e;
  }
`;
