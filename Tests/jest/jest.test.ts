import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { apiClient } from "../../Mobile/src/api";
import Home from "../../Mobile/src/app/(tabs)/Home";
import { AuthInput } from "../../Mobile/src/components/shared/AuthInput";
import { logInSchema, signUpSchema } from "../../Mobile/src/schemas/auth";

jest.mock("../../Mobile/src/api", () => ({
  apiClient: {
    getLibrary: jest.fn(),
  },
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return { SafeAreaView: View };
});

jest.mock("../../Mobile/src/components/gameComponents/GameCoverCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    __esModule: true,
    default: ({ game }: { game: { name: string } }) =>
      React.createElement(Text, null, game.name),
  };
});

test("accepts valid login details and rejects invalid email or empty password", () => {
  expect(
    logInSchema.safeParse({
      email: "player@example.com",
      password: "secret",
    }).success,
  ).toBe(true);
  expect(
    logInSchema.safeParse({ email: "not-an-email", password: "" }).success,
  ).toBe(false);
});

it("requires matching signup passwords", () => {
  const result = signUpSchema.safeParse({
    name: "Player",
    email: "player@example.com",
    password: "password123",
    confirmPassword: "different123",
  });

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues).toContainEqual(
      expect.objectContaining({ path: ["confirmPassword"] }),
    );
  }
});

it("renders input errors and forwards text changes", () => {
  const onChangeText = jest.fn();
  type IconComponent = React.ComponentProps<typeof AuthInput>["icon"];
  const IconStub: IconComponent = React.forwardRef<
    React.ComponentRef<IconComponent>,
    React.ComponentProps<IconComponent>
  >(() => null);
  const { getByPlaceholderText, getByText } = render(
    React.createElement(AuthInput, {
      icon: IconStub,
      placeholder: "Email",
      error: "Enter a valid email address",
      onChangeText,
    }),
  );

  fireEvent.changeText(getByPlaceholderText("Email"), "player@example.com");

  expect(getByText("Enter a valid email address")).toBeTruthy();
  expect(onChangeText).toHaveBeenCalledWith("player@example.com");
});

test("loads and displays games returned by the API", async () => {
  const getLibrary = jest.mocked(apiClient.getLibrary);
  getLibrary.mockResolvedValue([
    {
      igdbGameId: 42,
      status: "playing",
      addedAt: "2026-01-01T00:00:00.000Z",
      game: { id: 42, name: "Portal 2" },
    },
  ]);

  const { findAllByText, getByText } = render(React.createElement(Home));

  expect(getByText("Loading your library...")).toBeTruthy();
  expect(getLibrary).toHaveBeenCalledTimes(1);
  expect(await findAllByText("Portal 2")).toHaveLength(2);
  expect(getByText("Continue playing")).toBeTruthy();
  expect(getByText("Your library", { exact: true })).toBeTruthy();
});