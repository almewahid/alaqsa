// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // دعم TypeScript + TSX
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy" // عشان تتجاهل ملفات CSS
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
