import React, { useState, useCallback } from "react";
import { usePat } from "../hooks/use-pat";
import { fetchUser } from "../apis/github-user";
import Input from "../common/input";
import Button from "../common/button";

function Welcome() {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPat } = usePat();
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) {
        return;
      }

      setIsSubmitting(true);
      fetchUser(inputValue)
        .then(() => {
          setPat(inputValue);
          setInputValue(""); // Clear input after setting token
        })
        .catch((error) => {
          console.error("Error fetching GitHub Orgs:", error);
          setInputValue("");
          setIsSubmitting(false);
          setError(
            "Failed a validation fetch to GitHub User. Please check your token and try again.",
          );
        });
    },
    [inputValue, setPat],
  );
  return (
    <div>
      <div className="relative isolate px-6 pt-5 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 lg:py-50">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Repo Tracker
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              See information such as GitHub Issues. To get started we need a
              GitHub Personal Access token.
            </p>
          </div>
          <div className="mt-10 grid gap-5">
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}
            <Input
              id="pat"
              label="Personal Access Token"
              placeholder="•••••••••"
              value={inputValue}
              onChange={setInputValue}
              type="password"
            />
            <Button
              variant="primary"
              onClick={handleSubmit}
              type="submit"
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Welcome;
