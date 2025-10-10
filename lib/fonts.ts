import { Roboto_Mono, Nunito_Sans} from "next/font/google";

export const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  style : 'normal',
  weight : ['300']
});

export const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  style: "normal",
  weight: ['800']
})