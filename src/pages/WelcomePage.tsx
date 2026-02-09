import { WelcomeSlider } from "../features/WelcomeSlider/WelcomeSlider";

type Props = {
  onCreateAccount: () => Promise<void>;
  tgReady: boolean;
};

const WelcomePage: React.FC<Props> = ({ onCreateAccount, tgReady }) => {
  return <WelcomeSlider onCreateAccount={onCreateAccount} tgReady={tgReady} />;
};
export default WelcomePage;
