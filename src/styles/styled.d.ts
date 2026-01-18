// src/styles/styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      card: string;
      muted: string;
      accent: string;
      inactive: string;
    };
  }
}
