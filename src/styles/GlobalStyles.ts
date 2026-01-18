// styles/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #000;
    color: #fff;
    font-family: Inter, system-ui, sans-serif;
  }

  button {
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
  }
`;
