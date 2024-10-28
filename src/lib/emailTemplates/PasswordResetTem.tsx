import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  url: string;
  name?: string;
}

const PasswordResetTemp = ({ url, name }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>
            {!name || undefined ? "Hi," : `Hi, ${name}`}
          </Text>
          <Text style={paragraph}>
            Welcome to ExamLabs,
            <br />
            You can reset your password, by clicking
            <br />
            on following button.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={url}>
              Reset Password
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            ExamLabs
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
export default PasswordResetTemp;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
