import { render, screen } from "@testing-library/react";
import TeacherPricing from "./TeacherPricing";
import { TeacherData } from "../types";

const mockTeacher: TeacherData = {
  id: "1",
  name: "John Doe",
  bio: "Math expert",
  personalInfo: {
    age: 30,
    location: "Cairo",
    languages: ["English", "Arabic"],
  },
  schedule: [
    { day: "Monday", times: ["10:00", "12:00"] },
    { day: "Wednesday", times: ["14:00"] },
  ],
  subjects: ["Math", "Physics"],
  pricing: {
    singleSession: 100,
    monthly: 300,
    discount: "10% off for groups",
  },
  experience: "5 years teaching high school",
  reviews: [
    { id: "r1", student: "Ali", rating: 5, comment: "Great teacher!" },
  ],
};

describe("TeacherPricing Component", () => {
  it("renders pricing information correctly", () => {
    render(<TeacherPricing teacher={mockTeacher} />);

    expect(screen.getByText(/Single Session: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly: 300/)).toBeInTheDocument();
    expect(screen.getByText(/10% off for groups/)).toBeInTheDocument();
  });
});
