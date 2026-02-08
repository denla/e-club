import React from "react";
import styled from "styled-components";
import { CLUB_REWARDS } from "./rewards.data";
import AppHeader from "../../features/AppHeader/AppHeader";
import { InfoCard } from "../../features/InfoCard/InfoCard";
import infocard_gift from "../../assets/images/info/infocard_gift.png";
import styles from "./RewardsPage.module.css";

export const RewardsPage: React.FC = () => {
  return (
    <div className={styles.page}>
      <AppHeader align="left" />
      <div className={styles.topContent}>
        Призы <span>от клуба</span>
      </div>

      <InfoCard
        title="Поднимайся в общем рейтинге"
        subtitle="Зарабатывай очки за активность и занимай первые строки"
        image={infocard_gift}
        buttonText="Узнать больше"
        onClick={() =>
          alert("Здесь будет подробная информация о топе болельщиков!")
        }
      />

      <Grid>
        {CLUB_REWARDS.map((reward) => (
          <Card key={reward.id}>
            <ImageWrapper>
              <RewardImage src={reward.img} alt={reward.title} />
            </ImageWrapper>

            <CardContent>
              <RewardTitle>{reward.title}</RewardTitle>
              <Level>{reward.level} посещений</Level>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </div>
  );
};

/* сетка 2 карточки в ряд */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RewardImage = styled.img`
  max-width: 70%;
  max-height: 70%;
  object-fit: contain;
`;

const CardContent = styled.div`
  padding: 14px;
  text-align: center;
`;

const RewardTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
`;

const Level = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;
